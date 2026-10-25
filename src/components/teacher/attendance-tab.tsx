"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoster } from "@/hooks/use-roster";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { AttendanceStatus, ClassListItem, OfferingAttendanceRecord } from "@/types/api";

const OPTIONS: { status: AttendanceStatus; label: string; active: string }[] = [
  { status: "PRESENT", label: "Present", active: "bg-success/15 text-success ring-1 ring-success/40" },
  { status: "LATE", label: "Late", active: "bg-warning/25 text-warning-foreground ring-1 ring-warning/50 dark:text-warning" },
  { status: "ABSENT", label: "Absent", active: "bg-destructive/10 text-destructive ring-1 ring-destructive/40" },
];

function todayLocal() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function AttendanceTab({ offeringId }: { offeringId: string }) {
  const [date, setDate] = useState(todayLocal);
  const roster = useRoster(offeringId);
  const existing = useQuery({
    queryKey: ["attendance-day", offeringId, date],
    queryFn: ({ signal }) => api.list<OfferingAttendanceRecord>(`attendance/offerings/${offeringId}`, { date, limit: 100 }, signal),
    enabled: /^\d{4}-\d{2}-\d{2}$/.test(date),
  });

  return (
    <div className="space-y-4">
      <div className="max-w-xs space-y-1.5">
        <Label htmlFor="attendance-date">Class date</Label>
        <Input id="attendance-date" type="date" className="h-9" max={todayLocal()} value={date} onChange={(event) => setDate(event.target.value)} />
      </div>

      {roster.isLoading || existing.isLoading ? (
        <Skeleton className="h-72 rounded-xl" />
      ) : !roster.data || roster.data.length === 0 ? (
        <Card>
          <EmptyState icon={CalendarCheck} title="No students to mark" description="Attendance can be taken once students enroll in this class." />
        </Card>
      ) : !existing.data ? (
        <Card>
          <EmptyState icon={CalendarCheck} title="Pick a valid class date" />
        </Card>
      ) : (
        // A new key (date or fresh data) resets the sheet to what the server has saved.
        <AttendanceSheet key={`${date}:${existing.dataUpdatedAt}`} offeringId={offeringId} date={date} roster={roster.data} saved={existing.data.data} />
      )}
    </div>
  );
}

interface AttendanceSheetProps {
  offeringId: string;
  date: string;
  roster: ClassListItem[];
  saved: OfferingAttendanceRecord[];
}

function AttendanceSheet({ offeringId, date, roster, saved }: AttendanceSheetProps) {
  const queryClient = useQueryClient();
  const alreadyMarked = saved.length > 0;
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(() => {
    const byEnrollment = new Map(saved.map((record) => [record.enrollmentId, record.status]));
    return Object.fromEntries(roster.map((item) => [item.id, byEnrollment.get(item.id) ?? "PRESENT"]));
  });

  const save = useMutation({
    mutationFn: () =>
      api.post("attendance", {
        offeringId,
        date,
        records: roster.map((item) => ({ enrollmentId: item.id, status: statuses[item.id] ?? "PRESENT" })),
      }),
    onSuccess: async () => {
      toast.success(alreadyMarked ? "Attendance updated" : "Attendance saved");
      await queryClient.invalidateQueries({ queryKey: ["attendance-day", offeringId] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save attendance"),
  });

  const counts = { PRESENT: 0, LATE: 0, ABSENT: 0 };
  for (const item of roster) counts[statuses[item.id] ?? "PRESENT"] += 1;
  const setAll = (status: AttendanceStatus) => setStatuses(Object.fromEntries(roster.map((item) => [item.id, status])));

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {alreadyMarked ? "Already marked for this day. You can correct it below." : "Not marked yet for this day."}{" "}
            <span className="whitespace-nowrap">
              <span className="font-medium text-foreground">{counts.PRESENT}</span> present ·{" "}
              <span className="font-medium text-foreground">{counts.LATE}</span> late ·{" "}
              <span className="font-medium text-foreground">{counts.ABSENT}</span> absent
            </span>
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setAll("PRESENT")}>
              All present
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAll("ABSENT")}>
              All absent
            </Button>
          </div>
        </div>

        <ul className="divide-y rounded-lg border">
          {roster.map((item) => (
            <li key={item.id} className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.student.name}</p>
                <p className="text-xs text-muted-foreground">{item.student.studentProfile?.studentId ?? item.student.email}</p>
              </div>
              <div role="radiogroup" aria-label={`Attendance for ${item.student.name}`} className="flex gap-1.5">
                {OPTIONS.map((option) => {
                  const selected = statuses[item.id] === option.status;
                  return (
                    <button
                      key={option.status}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setStatuses((current) => ({ ...current, [item.id]: option.status }))}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                        selected ? option.active : "bg-muted/60 text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>

        <Button disabled={save.isPending} onClick={() => save.mutate()}>
          {save.isPending ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {save.isPending ? "Saving..." : alreadyMarked ? "Update attendance" : "Save attendance"}
        </Button>
      </CardContent>
    </Card>
  );
}