"use client";

import { Users } from "lucide-react";
import { DataTable, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { useRoster } from "@/hooks/use-roster";
import { formatDate } from "@/lib/format";
import type { ClassListItem } from "@/types/api";

const columns: Column<ClassListItem>[] = [
  { id: "name", header: "Student", cell: (item) => <span className="font-medium">{item.student.name}</span> },
  { id: "studentId", header: "Student ID", className: "tabular-nums", cell: (item) => item.student.studentProfile?.studentId ?? "-" },
  { id: "email", header: "Email", hideOnMobile: true, cell: (item) => item.student.email },
  { id: "date", header: "Enrolled on", hideOnMobile: true, cell: (item) => formatDate(item.createdAt) },
];

export function StudentsTab({ offeringId }: { offeringId: string }) {
  const roster = useRoster(offeringId);
  return (
    <DataTable
      columns={columns}
      rows={roster.data}
      getRowId={(item) => item.id}
      isLoading={roster.isLoading}
      empty={<EmptyState icon={Users} title="No students enrolled yet" description="Students appear here once they enroll in this class." />}
    />
  );
}