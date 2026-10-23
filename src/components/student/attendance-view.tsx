"use client";

import { CalendarCheck, TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { FilterSelect } from "@/components/common/filter-select";
import { ProgressBar } from "@/components/common/progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useListParams } from "@/hooks/use-list-params";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AttendanceStatus, MyAttendance } from "@/types/api";

const DOT: Record<AttendanceStatus, string> = {
  PRESENT: "bg-success",
  LATE: "bg-warning",
  ABSENT: "bg-destructive",
};

export function AttendanceView({ items }: { items: MyAttendance[] }) {
  const params = useListParams({ filterKeys: ["semester"] });
  const semesters = [...new Set(items.map((item) => item.offering.semester))];
  const selected = params.filters.semester ?? "";
  const visible = selected ? items.filter((item) => item.offering.semester === selected) : items;

  if (items.length === 0) {
    return (
      <Card>
        <EmptyState icon={CalendarCheck} title="No attendance recorded yet" description="Once your teachers start taking attendance, your records will show up here." />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {semesters.length > 1 ? (
        <FilterSelect value={selected} onChange={(value) => params.setFilter("semester", value)} allLabel="All semesters" options={semesters.map((s) => ({ value: s, label: s }))} />
      ) : null}

      {visible.length === 0 ? (
        <Card>
          <EmptyState icon={CalendarCheck} title="No records for this semester" action={<Button variant="outline" onClick={params.reset}>Show all</Button>} />
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((item) => {
          const { summary } = item;
          const low = summary.totalClasses > 0 && summary.percentage < 75;
          return (
            <Card key={item.enrollmentId}>
              <CardHeader>
                <CardTitle>
                  {item.offering.course.code} <span className="font-normal text-muted-foreground">· {item.offering.course.title}</span>
                </CardTitle>
                <CardDescription>
                  {item.offering.semester} · Section {item.offering.section}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-semibold tabular-nums">{summary.percentage.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground">{summary.totalClasses} classes</span>
                  </div>
                  <ProgressBar value={summary.percentage} label={`${item.offering.course.code} attendance`} />
                </div>

                <dl className="grid grid-cols-3 gap-2 text-center text-sm">
                  {(
                    [
                      ["Present", summary.present, "PRESENT"],
                      ["Late", summary.late, "LATE"],
                      ["Absent", summary.absent, "ABSENT"],
                    ] as const
                  ).map(([label, count, status]) => (
                    <div key={label} className="rounded-lg bg-muted/60 px-2 py-2">
                      <dt className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <span className={cn("size-1.5 rounded-full", DOT[status])} aria-hidden />
                        {label}
                      </dt>
                      <dd className="font-semibold tabular-nums">{count}</dd>
                    </div>
                  ))}
                </dl>

                {low ? (
                  <p className="flex items-start gap-2 rounded-lg bg-warning/25 px-3 py-2 text-xs text-warning-foreground dark:text-warning">
                    <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    Your attendance is below 75% in this course.
                  </p>
                ) : null}

                {item.records.length > 0 ? (
                  <details className="group text-sm">
                    <summary className="cursor-pointer text-primary underline-offset-4 select-none hover:underline">
                      View all {item.records.length} classes
                    </summary>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {item.records.map((record) => (
                        <li key={record.date} className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
                          <span className={cn("size-1.5 rounded-full", DOT[record.status])} aria-hidden />
                          {formatDate(record.date)}
                          <span className="sr-only">{record.status.toLowerCase()}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}