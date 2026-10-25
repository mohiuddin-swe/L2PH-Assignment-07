"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Megaphone, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { SearchInput } from "@/components/common/search-input";
import { NoticeFormDialog } from "@/components/notices/notice-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useListParams } from "@/hooks/use-list-params";
import { useListQuery } from "@/hooks/use-list-query";
import { api } from "@/lib/api-client";
import { formatDateTime } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";
import type { Notice } from "@/types/api";

// Shared by teachers and admins. Teachers can change only their own notices; admins can change any.
export function NoticesView() {
  const user = useAuthStore((state) => state.user);
  const params = useListParams({ defaultLimit: 6, defaultSortBy: "createdAt" });
  const list = useListQuery<Notice>("notices", "notices", params.query);
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [deleting, setDeleting] = useState<Notice | null>(null);

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`notices/${id}`),
    onSuccess: async () => {
      toast.success("Notice deleted");
      setDeleting(null);
      await queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (error) => {
      setDeleting(null);
      toast.error(error instanceof Error ? error.message : "Could not delete the notice");
    },
  });

  const canManage = (notice: Notice) => user?.role === "ADMIN" || notice.author.id === user?.id;
  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Notices"
        description="Announcements for everyone in the university."
        actions={
          <Button onClick={openCreate}>
            <Plus aria-hidden />
            New notice
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <SearchInput value={params.q} onChange={params.setSearch} placeholder="Search notices..." />
      </div>

      {list.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : list.data && list.data.data.length > 0 ? (
        <div className={params.isPending || list.isFetching ? "space-y-3 opacity-60 transition-opacity" : "space-y-3 transition-opacity"}>
          {list.data.data.map((notice) => (
            <Card key={notice.id}>
              <CardContent className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-medium">{notice.title}</h2>
                  {canManage(notice) ? (
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${notice.title}`}
                        onClick={() => {
                          setEditing(notice);
                          setFormOpen(true);
                        }}
                      >
                        <Pencil aria-hidden />
                      </Button>
                      <Button variant="ghost" size="icon-sm" aria-label={`Delete ${notice.title}`} onClick={() => setDeleting(notice)}>
                        <Trash2 className="text-destructive" aria-hidden />
                      </Button>
                    </div>
                  ) : null}
                </div>
                <p className="text-sm whitespace-pre-line text-muted-foreground">{notice.content}</p>
                <p className="text-xs text-muted-foreground">
                  {notice.author.name} · {formatDateTime(notice.createdAt)}
                  {notice.updatedAt !== notice.createdAt ? " · edited" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
          <Pagination meta={list.data.meta} onPageChange={params.setPage} />
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Megaphone}
            title={params.hasActiveFilters ? "No notices match your search" : "No notices yet"}
            description={params.hasActiveFilters ? undefined : "Post the first announcement for your students."}
            action={
              params.hasActiveFilters ? (
                <Button variant="outline" onClick={params.reset}>
                  Clear search
                </Button>
              ) : (
                <Button onClick={openCreate}>New notice</Button>
              )
            }
          />
        </Card>
      )}

      <NoticeFormDialog open={formOpen} onOpenChange={setFormOpen} notice={editing} />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => (open ? undefined : setDeleting(null))}
        title="Delete this notice?"
        description={deleting ? `"${deleting.title}" will be removed for everyone. This cannot be undone.` : ""}
        confirmLabel="Delete notice"
        pending={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting.id)}
      />
    </>
  );
}