"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Check, Loader2 } from "lucide-react";
import { DataTable, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { FilterSelect } from "@/components/common/filter-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEnroll } from "@/hooks/use-enrollment-actions";
import { useListParams } from "@/hooks/use-list-params";
import { useListQuery } from "@/hooks/use-list-query";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { MyEnrollment, Offering } from "@/types/api";

export function CoursesView() {
  const params = useListParams({ filterKeys: ["semester"], defaultLimit: 10, defaultSortBy: "createdAt" });
  const list = useListQuery<Offering>("offerings", "offerings", params.query);
  const enroll = useEnroll();

  // Which offerings the student already holds a seat in, so the button can say "Enrolled".
  const enrolled = useQuery({
    queryKey: ["enrolled-offerings"],
    queryFn: ({ signal }) => api.list<MyEnrollment>("enrollments/my", { status: "ENROLLED", limit: 100 }, signal),
  });
  const enrolledIds = new Set(enrolled.data?.data.map((enrollment) => enrollment.offering.id));

  // Semester names for the filter come from the offerings themselves.
  const semesters = useQuery({
    queryKey: ["offering-semesters"],
    queryFn: async ({ signal }) => {
      const result = await api.list<Offering>("offerings", { limit: 100 }, signal);
      return [...new Set(result.data.map((offering) => offering.semester))];
    },
    staleTime: 5 * 60 * 1000,
  });

  const columns: Column<Offering>[] = [
    {
      id: "course",
      header: "Course",
      cell: (offering) => (
        <div className="min-w-0">
          <p className="font-medium">{offering.course.code}</p>
          <p className="text-xs text-muted-foreground">{offering.course.title}</p>
        </div>
      ),
    },
    {
      id: "semester",
      header: "Semester",
      sortKey: "semester",
      hideOnMobile: true,
      cell: (offering) => `${offering.semester} · Sec ${offering.section}`,
    },
    { id: "teacher", header: "Teacher", hideOnMobile: true, cell: (offering) => offering.teacher.name },
    { id: "credit", header: "Credit", align: "right", className: "tabular-nums", cell: (offering) => offering.course.credit },
    {
      id: "seats",
      header: "Seats",
      align: "right",
      cell: (offering) => (
        <span className={cn("tabular-nums", offering.availableSeats === 0 && "text-destructive")}>
          {offering.availableSeats === 0 ? "Full" : `${offering.availableSeats} left`}
          <span className="hidden text-muted-foreground lg:inline"> / {offering.capacity}</span>
        </span>
      ),
    },
    {
      id: "action",
      header: "",
      align: "right",
      cell: (offering) => {
        if (enrolledIds.has(offering.id)) {
          return (
            <Badge variant="secondary" className="gap-1 bg-success/15 text-success">
              <Check className="size-3" aria-hidden />
              Enrolled
            </Badge>
          );
        }
        const busy = enroll.isPending && enroll.variables === offering.id;
        return (
          <Button size="sm" disabled={offering.availableSeats === 0 || enroll.isPending} onClick={() => enroll.mutate(offering.id)}>
            {busy ? <Loader2 className="animate-spin" aria-hidden /> : null}
            {offering.availableSeats === 0 ? "Full" : busy ? "Enrolling..." : "Enroll"}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <FilterSelect
        value={params.filters.semester ?? ""}
        onChange={(value) => params.setFilter("semester", value)}
        allLabel="All semesters"
        options={(semesters.data ?? []).map((semester) => ({ value: semester, label: semester }))}
      />
      <DataTable
        columns={columns}
        rows={list.data?.data}
        getRowId={(offering) => offering.id}
        isLoading={list.isLoading}
        isFetching={list.isFetching}
        sortBy={params.sortBy}
        order={params.order}
        onSort={params.setSort}
        meta={list.data?.meta}
        onPageChange={params.setPage}
        onLimitChange={params.setLimit}
        empty={
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description={params.hasActiveFilters ? "No offerings match this semester." : "No course offerings are open right now."}
            action={params.hasActiveFilters ? <Button variant="outline" onClick={params.reset}>Clear filter</Button> : undefined}
          />
        }
      />
    </div>
  );
}