"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DataTable, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { FilterSelect } from "@/components/common/filter-select";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { useListParams } from "@/hooks/use-list-params";
import { useListQuery } from "@/hooks/use-list-query";
import { api } from "@/lib/api-client";
import { ROLE_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";
import type { AdminUser } from "@/types/api";

const ROLE_OPTIONS = [
  { value: "STUDENT", label: "Students" },
  { value: "TEACHER", label: "Teachers" },
  { value: "ADMIN", label: "Admins" },
];
const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
];

export function UsersView() {
  const me = useAuthStore((state) => state.user);
  const params = useListParams({ filterKeys: ["role", "status"], defaultSortBy: "createdAt" });
  const list = useListQuery<AdminUser>("admin-users", "admin/users", params.query);
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [target, setTarget] = useState<AdminUser | null>(null);

  const toggle = useMutation({
    mutationFn: (user: AdminUser) => api.patch(`admin/users/${user.id}/status`, { status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }),
    onSuccess: async (_result, user) => {
      toast.success(user.status === "ACTIVE" ? `${user.name} suspended` : `${user.name} reactivated`);
      setTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      setTarget(null);
      toast.error(error instanceof Error ? error.message : "Could not change the status");
    },
  });

  const columns: Column<AdminUser>[] = [
    {
      id: "name",
      header: "User",
      sortKey: "name",
      cell: (user) => (
        <div className="min-w-0">
          <p className="font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      ),
    },
    { id: "role", header: "Role", cell: (user) => ROLE_LABEL[user.role] },
    { id: "status", header: "Status", cell: (user) => <StatusBadge status={user.status} /> },
    { id: "joined", header: "Joined", sortKey: "createdAt", hideOnMobile: true, cell: (user) => formatDate(user.createdAt) },
    {
      id: "action",
      header: "",
      align: "right",
      cell: (user) =>
        user.id === me?.id ? (
          <span className="text-xs text-muted-foreground">You</span>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setTarget(user)}>
            {user.status === "ACTIVE" ? "Suspend" : "Activate"}
          </Button>
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Users"
        description="Every account in the system."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus aria-hidden />
            Add user
          </Button>
        }
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={params.q} onChange={params.setSearch} placeholder="Search name or email..." />
        <FilterSelect value={params.filters.role ?? ""} onChange={(value) => params.setFilter("role", value)} allLabel="All roles" options={ROLE_OPTIONS} />
        <FilterSelect value={params.filters.status ?? ""} onChange={(value) => params.setFilter("status", value)} allLabel="All statuses" options={STATUS_OPTIONS} />
      </div>
      <DataTable
        columns={columns}
        rows={list.data?.data}
        getRowId={(user) => user.id}
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
            icon={Users}
            title="No users found"
            description={params.hasActiveFilters ? "Try a different search or filter." : "Add the first user."}
            action={params.hasActiveFilters ? <Button variant="outline" onClick={params.reset}>Reset filters</Button> : undefined}
          />
        }
      />
      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => (open ? undefined : setTarget(null))}
        tone={target?.status === "ACTIVE" ? "destructive" : "default"}
        title={target?.status === "ACTIVE" ? `Suspend ${target.name}?` : `Reactivate ${target?.name ?? ""}?`}
        description={target?.status === "ACTIVE" ? "They will not be able to sign in until you reactivate the account." : "They will be able to sign in again."}
        confirmLabel={target?.status === "ACTIVE" ? "Suspend user" : "Reactivate"}
        cancelLabel="Cancel"
        pending={toggle.isPending}
        onConfirm={() => target && toggle.mutate(target)}
      />
    </>
  );
}
