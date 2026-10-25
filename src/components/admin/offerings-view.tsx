"use client";

import { Library } from "lucide-react";
import Link from "next/link";
import { DataTable, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { useListParams } from "@/hooks/use-list-params";
import { useListQuery } from "@/hooks/use-list-query";
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
  { id: "semester", header: "Semester", sortKey: "semester", cell: (offering) => `${offering.semester} · Sec ${offering.section}` },
  { id: "teacher", header: "Teacher", hideOnMobile: true, cell: (offering) => offering.teacher.name },
  {
    id: "seats",
    header: "Seats",
    align: "right",
    className: "tabular-nums",
    cell: (offering) => `${offering.enrolledCount} / ${offering.capacity}`,
  },
];

export function OfferingsView() {
  const params = useListParams({ defaultSortBy: "createdAt" });
  const list = useListQuery<Offering>("offerings", "offerings", params.query);

  return (
    <>
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
            icon={Library}
            title="No offerings yet"
            description="Create an offering to open a course for enrollment."
            action={
              <Link href="/admin/academics/new" className={buttonVariants()}>
                Create offering
              </Link>
            }
          />
        }
      />
    </>
  );
}
