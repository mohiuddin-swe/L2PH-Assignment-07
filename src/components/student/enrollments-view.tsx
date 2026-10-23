"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { DataTable, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/common/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { useListParams } from "@/hooks/use-list-params";
import { useListQuery } from "@/hooks/use-list-query";
import { formatDate } from "@/lib/format";
import type { MyEnrollment } from "@/types/api";

const columns: Column<MyEnrollment>[] = [
  {
    id: "course",
    header: "Course",
    cell: (enrollment) => (
      <div className="min-w-0">
        <p className="font-medium">{enrollment.offering.course.code}</p>
        <p className="text-xs text-muted-foreground">{enrollment.offering.course.title}</p>
      </div>
    ),
  },
  {
    id: "semester",
    header: "Semester",
    hideOnMobile: true,
    cell: (enrollment) => `${enrollment.offering.semester} · Sec ${enrollment.offering.section}`,
  },
  { id: "teacher", header: "Teacher", hideOnMobile: true, cell: (enrollment) => enrollment.offering.teacher.name },
  { id: "credit", header: "Credit", align: "right", className: "tabular-nums", cell: (enrollment) => enrollment.offering.course.credit },
  { id: "status", header: "Status", cell: (enrollment) => <StatusBadge status={enrollment.status} /> },
  { id: "date", header: "Enrolled on", hideOnMobile: true, cell: (enrollment) => formatDate(enrollment.createdAt) },
];

export function EnrollmentsView() {
  const params = useListParams();
  const list = useListQuery<MyEnrollment>("my-enrollments", "enrollments/my", params.query);

  return (
    <DataTable
      columns={columns}
      rows={list.data?.data}
      getRowId={(enrollment) => enrollment.id}
      isLoading={list.isLoading}
      isFetching={list.isFetching}
      meta={list.data?.meta}
      onPageChange={params.setPage}
      onLimitChange={params.setLimit}
      empty={
        <EmptyState
          icon={ClipboardList}
          title="You have not enrolled in any course"
          description="Browse the course offerings for this semester and enroll."
          action={
            <Link href="/student/courses" className={buttonVariants()}>
              Browse courses
            </Link>
          }
        />
      }
    />
  );
}