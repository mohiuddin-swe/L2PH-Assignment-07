"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { DataTable, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { FilterSelect } from "@/components/common/filter-select";
import { Button, buttonVariants } from "@/components/ui/button";
import { useListParams } from "@/hooks/use-list-params";
import { useListQuery } from "@/hooks/use-list-query";
import { api } from "@/lib/api-client";
import type { Offering } from "@/types/api";

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
  { id: "semester", header: "Semester", hideOnMobile: true, cell: (offering) => `${offering.semester} · Sec ${offering.section}` },
  { id: "credit", header: "Credit", align: "right", className: "tabular-nums", cell: (offering) => offering.course.credit },
  {
    id: "students",
    header: "Students",
    align: "right",
    className: "tabular-nums",
    cell: (offering) => `${offering.enrolledCount} / ${offering.capacity}`,
  },
  {
    id: "action",
    header: "",
    align: "right",
    cell: (offering) => (
      <Link href={`/teacher/offerings/${offering.id}`} className={buttonVariants({ size: "sm" })}>
        Open
      </Link>
    ),
  },
];

export function ClassesView() {
  const params = useListParams({ filterKeys: ["semester"] });
  const list = useListQuery<Offering>("assigned-offerings", "offerings/my-assigned", params.query);

  const semesters = useQuery({
    queryKey: ["assigned-semesters"],
    queryFn: async ({ signal }) => {
      const result = await api.list<Offering>("offerings/my-assigned", { limit: 100 }, signal);
      return [...new Set(result.data.map((offering) => offering.semester))];
    },
    staleTime: 5 * 60 * 1000,
  });

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
        meta={list.data?.meta}
        onPageChange={params.setPage}
        onLimitChange={params.setLimit}
        empty={
          <EmptyState
            icon={BookOpen}
            title="No classes assigned"
            description={params.hasActiveFilters ? "No classes match this semester." : "An admin will assign course offerings to you."}
            action={params.hasActiveFilters ? <Button variant="outline" onClick={params.reset}>Clear filter</Button> : undefined}
          />
        }
      />
    </div>
  );
}