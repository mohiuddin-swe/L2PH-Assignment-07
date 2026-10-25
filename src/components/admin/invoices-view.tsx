"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Receipt } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateInvoiceDialog } from "@/components/admin/create-invoice-dialog";
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
import { formatDate, formatMoney } from "@/lib/format";
import type { Invoice } from "@/types/api";

const STATUS_OPTIONS = [
  { value: "UNPAID", label: "Unpaid" },
  { value: "PAID", label: "Paid" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function AdminInvoicesView() {
  const params = useListParams({ filterKeys: ["status"], defaultSortBy: "createdAt" });
  const list = useListQuery<Invoice>("admin-invoices", "invoices", params.query);
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [target, setTarget] = useState<Invoice | null>(null);

  const cancel = useMutation({
    mutationFn: (invoice: Invoice) => api.patch(`invoices/${invoice.id}/cancel`),
    onSuccess: async () => {
      toast.success("Invoice cancelled");
      setTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-invoices"] });
    },
    onError: (error) => {
      setTarget(null);
      toast.error(error instanceof Error ? error.message : "Could not cancel the invoice");
    },
  });

  const columns: Column<Invoice>[] = [
    {
      id: "title",
      header: "Invoice",
      cell: (invoice) => (
        <div className="min-w-0">
          <p className="font-medium">{invoice.title}</p>
          <p className="text-xs text-muted-foreground">{invoice.student ? `${invoice.student.name} · ${invoice.student.email}` : invoice.semester}</p>
        </div>
      ),
    },
    { id: "semester", header: "Semester", hideOnMobile: true, cell: (invoice) => invoice.semester ?? "-" },
    { id: "amount", header: "Amount", sortKey: "amount", align: "right", className: "tabular-nums", cell: (invoice) => formatMoney(invoice.amount, invoice.currency) },
    { id: "due", header: "Due", sortKey: "dueDate", hideOnMobile: true, cell: (invoice) => (invoice.dueDate ? formatDate(invoice.dueDate) : "-") },
    { id: "status", header: "Status", cell: (invoice) => <StatusBadge status={invoice.status} /> },
    {
      id: "action",
      header: "",
      align: "right",
      cell: (invoice) =>
        invoice.status === "UNPAID" ? (
          <Button variant="outline" size="sm" onClick={() => setTarget(invoice)}>
            Cancel
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader
        title="Invoices"
        description="Create and manage student invoices."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus aria-hidden />
            New invoice
          </Button>
        }
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={params.q} onChange={params.setSearch} placeholder="Search invoices..." />
        <FilterSelect value={params.filters.status ?? ""} onChange={(value) => params.setFilter("status", value)} allLabel="All statuses" options={STATUS_OPTIONS} />
      </div>
      <DataTable
        columns={columns}
        rows={list.data?.data}
        getRowId={(invoice) => invoice.id}
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
            icon={Receipt}
            title="No invoices found"
            description={params.hasActiveFilters ? "Try a different search or filter." : "Create the first invoice for a student."}
            action={params.hasActiveFilters ? <Button variant="outline" onClick={params.reset}>Reset filters</Button> : undefined}
          />
        }
      />
      <CreateInvoiceDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => (open ? undefined : setTarget(null))}
        title="Cancel this invoice?"
        description={target ? `"${target.title}" will be cancelled and the student can no longer pay it.` : ""}
        confirmLabel="Cancel invoice"
        cancelLabel="Keep invoice"
        pending={cancel.isPending}
        onConfirm={() => target && cancel.mutate(target)}
      />
    </>
  );
}
