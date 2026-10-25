"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DepartmentFormDialog } from "@/components/admin/department-form-dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DataTable, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { SearchInput } from "@/components/common/search-input";
import { Button } from "@/components/ui/button";
import { useListParams } from "@/hooks/use-list-params";
import { useListQuery } from "@/hooks/use-list-query";
import { api } from "@/lib/api-client";
import type { Department } from "@/types/api";

export function DepartmentsView() {
  const params = useListParams();
  const list = useListQuery<Department>("departments", "departments", params.query);
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [deleting, setDeleting] = useState<Department | null>(null);

  const remove = useMutation({
    mutationFn: (department: Department) => api.delete(`departments/${department.id}`),
    onSuccess: async () => {
      toast.success("Department deleted");
      setDeleting(null);
      await queryClient.invalidateQueries({ queryKey: ["departments"] });
      await queryClient.invalidateQueries({ queryKey: ["department-options"] });
    },
    onError: (error) => {
      setDeleting(null);
      toast.error(error instanceof Error ? error.message : "Could not delete the department");
    },
  });

  const columns: Column<Department>[] = [
    { id: "name", header: "Department", cell: (department) => <span className="font-medium">{department.name}</span> },
    { id: "code", header: "Code", className: "font-mono text-xs", cell: (department) => department.code },
    { id: "courses", header: "Courses", align: "right", className: "tabular-nums", cell: (department) => department._count.courses },
    {
      id: "action",
      header: "",
      align: "right",
      cell: (department) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${department.name}`}
            onClick={() => {
              setEditing(department);
              setFormOpen(true);
            }}
          >
            <Pencil aria-hidden />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${department.name}`} onClick={() => setDeleting(department)}>
            <Trash2 className="text-destructive" aria-hidden />
          </Button>
        </div>
      ),
    },
  ];

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={params.q} onChange={params.setSearch} placeholder="Search departments..." />
        <Button onClick={openCreate}>
          <Plus aria-hidden />
          New department
        </Button>
      </div>
      <DataTable
        columns={columns}
        rows={list.data?.data}
        getRowId={(department) => department.id}
        isLoading={list.isLoading}
        isFetching={list.isFetching}
        meta={list.data?.meta}
        onPageChange={params.setPage}
        onLimitChange={params.setLimit}
        empty={
          <EmptyState
            icon={Building2}
            title="No departments found"
            description={params.hasActiveFilters ? "Try a different search." : "Create the first department."}
            action={params.hasActiveFilters ? <Button variant="outline" onClick={params.reset}>Clear search</Button> : <Button onClick={openCreate}>New department</Button>}
          />
        }
      />
      <DepartmentFormDialog open={formOpen} onOpenChange={setFormOpen} department={editing} />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => (open ? undefined : setDeleting(null))}
        title="Delete this department?"
        description={deleting ? `${deleting.name} will be removed. A department that still has courses cannot be deleted.` : ""}
        confirmLabel="Delete department"
        pending={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting)}
      />
    </div>
  );
}
