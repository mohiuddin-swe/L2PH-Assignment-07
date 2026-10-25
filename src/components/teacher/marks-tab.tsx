"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/common/status-badge";
import { GradeBadge } from "@/components/student/grade-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoster } from "@/hooks/use-roster";
import { api } from "@/lib/api-client";
import type { ClassListItem, OfferingResult } from "@/types/api";

export function MarksTab({ offeringId }: { offeringId: string }) {
  const roster = useRoster(offeringId);
  const results = useQuery({
    queryKey: ["offering-results", offeringId],
    queryFn: ({ signal }) => api.list<OfferingResult>(`results/offerings/${offeringId}`, { limit: 100 }, signal),
    select: (result) => result.data,
  });

  if (roster.isLoading || results.isLoading) return <Skeleton className="h-72 rounded-xl" />;
  if (!roster.data || roster.data.length === 0) {
    return (
      <Card>
        <EmptyState icon={Award} title="No students to grade" description="Marks can be entered once students enroll in this class." />
      </Card>
    );
  }
  // Keyed on the fetch time so the sheet resets to the saved marks after every save or publish.
  return <MarksSheet key={results.dataUpdatedAt} offeringId={offeringId} roster={roster.data} results={results.data ?? []} />;
}

interface MarksSheetProps {
  offeringId: string;
  roster: ClassListItem[];
  results: OfferingResult[];
}

function parseMarks(text: string): number | null {
  if (text.trim() === "") return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : Number.NaN;
}

function MarksSheet({ offeringId, roster, results }: MarksSheetProps) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const byEnrollment = new Map(results.map((result) => [result.enrollment.id, result]));
  const initial = Object.fromEntries(roster.map((item) => [item.id, byEnrollment.has(item.id) ? String(byEnrollment.get(item.id)!.marks) : ""]));
  const [values, setValues] = useState<Record<string, string>>(initial);

  const invalid = (id: string) => {
    const marks = parseMarks(values[id] ?? "");
    return marks !== null && (Number.isNaN(marks) || marks < 0 || marks > 100);
  };
  const isLocked = (id: string) => byEnrollment.get(id)?.status === "PUBLISHED";
  const changed = roster.filter((item) => !isLocked(item.id) && (values[item.id] ?? "") !== initial[item.id] && (values[item.id] ?? "").trim() !== "");
  const anyInvalid = roster.some((item) => invalid(item.id));
  const allGraded = roster.every((item) => byEnrollment.has(item.id));
  const drafts = results.filter((result) => result.status === "DRAFT").length;

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["offering-results", offeringId] });

  const save = useMutation({
    mutationFn: async () => {
      const outcomes = await Promise.allSettled(
        changed.map((item) => api.put("results", { enrollmentId: item.id, marks: Number(values[item.id]) })),
      );
      const failed = outcomes.filter((outcome) => outcome.status === "rejected");
      if (failed.length > 0) {
        const first = failed[0] as PromiseRejectedResult;
        throw new Error(`${failed.length} of ${outcomes.length} could not be saved. ${first.reason instanceof Error ? first.reason.message : ""}`);
      }
      return outcomes.length;
    },
    onSuccess: (count) => toast.success(`Saved marks for ${count} student${count === 1 ? "" : "s"}`),
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save marks"),
    onSettled: refresh,
  });

  const publish = useMutation({
    mutationFn: () => api.post(`results/offerings/${offeringId}/publish`),
    onSuccess: () => {
      toast.success("Results published. Students can see them now.");
      setConfirmOpen(false);
    },
    onError: (error) => {
      setConfirmOpen(false);
      toast.error(error instanceof Error ? error.message : "Could not publish results");
    },
    onSettled: refresh,
  });

  const canPublish = allGraded && drafts > 0 && changed.length === 0 && !anyInvalid;

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Enter marks out of 100 and save. Results stay as a draft until you publish them, and published results cannot be changed.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={changed.length === 0 || anyInvalid || save.isPending} onClick={() => save.mutate()}>
              {save.isPending ? <Loader2 className="animate-spin" aria-hidden /> : null}
              Save marks{changed.length > 0 ? ` (${changed.length})` : ""}
            </Button>
            <Button disabled={!canPublish || publish.isPending} onClick={() => setConfirmOpen(true)}>
              <Send aria-hidden />
              Publish
            </Button>
          </div>
        </div>

        {!allGraded ? (
          <p className="text-xs text-muted-foreground">Every enrolled student needs saved marks before you can publish.</p>
        ) : changed.length > 0 ? (
          <p className="text-xs text-muted-foreground">Save your changes before publishing.</p>
        ) : null}

        <ul className="divide-y rounded-lg border">
          {roster.map((item) => {
            const result = byEnrollment.get(item.id);
            const locked = isLocked(item.id);
            const bad = invalid(item.id);
            return (
              <li key={item.id} className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.student.name}</p>
                  <p className="text-xs text-muted-foreground">{item.student.studentProfile?.studentId ?? item.student.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  {result ? (
                    <>
                      <GradeBadge grade={result.grade} />
                      <StatusBadge status={result.status} />
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not graded</span>
                  )}
                  <div className="w-24">
                    <Input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={100}
                      step="0.01"
                      className="h-9 text-right tabular-nums"
                      aria-label={`Marks for ${item.student.name}`}
                      aria-invalid={bad}
                      disabled={locked}
                      value={values[item.id] ?? ""}
                      onChange={(event) => setValues((current) => ({ ...current, [item.id]: event.target.value }))}
                    />
                  </div>
                </div>
                {bad ? (
                  <p role="alert" className="text-xs text-destructive sm:basis-full sm:text-right">
                    Marks must be between 0 and 100
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        tone="default"
        title="Publish results?"
        description={`${drafts} result${drafts === 1 ? "" : "s"} will become visible to students and count towards their GPA. Published results cannot be edited.`}
        confirmLabel="Publish results"
        cancelLabel="Not yet"
        pending={publish.isPending}
        onConfirm={() => publish.mutate()}
      />
    </Card>
  );
}