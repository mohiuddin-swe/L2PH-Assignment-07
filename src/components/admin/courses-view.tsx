"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CourseFormDialog } from "@/components/admin/course-form-dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DataTable, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { Button } from "@/components/ui/button";
import { useListParams } from "@/hooks/use-list-params";
import { useListQuery } from "@/hooks/use-list-query";
import { api } from "@/lib/api-client";
import type { Course, Department } from "@/types/api";

export function CoursesView() {
  const params = useListParams({ filterKeys: ["departmentId"], defaultSortBy: "code", defaultOrder: "asc" });
  const list = useListQuery<Course>("courses", "courses", params.query);
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState<Course | null>(null);

  const departments = useQuery({
    queryKey: ["department-options"],
    queryFn: ({ signal }) => api.list<Department>("departments", { limit: 100 }, signal),
    select: (result) => result.data,
  });

  const remove = useMutation({
    mutationFn: (course: Course) => api.delete(`courses/${course.id}`),
    onSuccess: async () => {
      toast.success("Course deleted");
      setDeleting(null);
      await queryClient.invalidateQueries({ queryKey: ["courses"] });
      await queryClient.invalidateQueries({ queryKey: ["course-options"] });
    },
    onError: (error) => {
      setDeleting(null);
      toast.error(error instanceof Error ? error.message : "Could not delete the course");
    },
  });

  const columns: Column<Course>[] = [
    {
      id: "course",
      header: "Course",
      sortKey: "code",
      cell: (course) => (
        <div className="min-w-0">
          <p className="font-medium">{course.code}</p>
          <p className="text-xs text-muted-foreground">{course.title}</p>
        </div>
      ),
    },
    { id: "department", header: "Department", hideOnMobile: true, cell: (course) => course.department.name },
    { id: "credit", header: "Credit", sortKey: "credit", align: "right", className: "tabular-nums", cell: (course) => course.credit },
    {
      id: "action",
      header: "",
      align: "right",
      cell: (course) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${course.code}`}
            onClick={() => {
              setEditing(course);
              setFormOpen(true);
            }}
          >
            <Pencil aria-hidden />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${course.code}`} onClick={() => setDeleting(course)}>
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
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchInput value={params.q} onChange={params.setSearch} placeholder="Search courses..." />
          <FilterSelect
            value={params.filters.departmentId ?? ""}
            onChange={(value) => params.setFilter("departmentId", value)}
            allLabel="All departments"
            options={(departments.data ?? []).map((department) => ({ value: department.id, label: department.name }))}
          />
        </div>
        <Button onClick={openCreate}>
          <Plus aria-hidden />
          New course
        </Button>
      </div>
      <DataTable
        columns={columns}
        rows={list.data?.data}
        getRowId={(course) => course.id}
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
            description={params.hasActiveFilters ? "Try a different search or department." : "Create the first course."}
            action={params.hasActiveFilters ? <Button variant="outline" onClick={params.reset}>Reset filters</Button> : <Button onClick={openCreate}>New course</Button>}
          />
        }
      />
      <CourseFormDialog open={formOpen} onOpenChange={setFormOpen} course={editing} />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => (open ? undefined : setDeleting(null))}
        title="Delete this course?"
        description={deleting ? `${deleting.code} · ${deleting.title} will be removed. A course that has offerings cannot be deleted.` : ""}
        confirmLabel="Delete course"
        pending={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting)}
      />
    </div>
  );
}
