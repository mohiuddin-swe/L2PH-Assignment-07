"use client";

import { CircleCheck, FileText, Info, Wallet } from "lucide-react";
import { DataTable, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { FilterSelect } from "@/components/common/filter-select";
import { StatCard, StatCardSkeleton } from "@/components/common/stat-card";
import { StatusBadge } from "@/components/common/status-badge";
import { PayButton } from "@/components/payments/pay-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useListParams } from "@/hooks/use-list-params";
import { useListQuery } from "@/hooks/use-list-query";
import { formatDate, formatMoney } from "@/lib/format";
import type { Invoice } from "@/types/api";

const STATUS_OPTIONS = [
  { value: "UNPAID", label: "Unpaid" },
  { value: "PAID", label: "Paid" },
  { value: "CANCELLED", label: "Cancelled" },
];

const columns: Column<Invoice>[] = [
  {
    id: "title",
    header: "Invoice",
    cell: (invoice) => (
      <div className="min-w-0">
        <p className="font-medium">{invoice.title}</p>
        {invoice.semester ? <p className="text-xs text-muted-foreground">{invoice.semester}</p> : null}
      </div>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    align: "right",
    className: "tabular-nums",
    cell: (invoice) => formatMoney(invoice.amount, invoice.currency),
  },
  { id: "due", header: "Due date", hideOnMobile: true, cell: (invoice) => formatDate(invoice.dueDate) },
  { id: "status", header: "Status", cell: (invoice) => <StatusBadge status={invoice.status} /> },
  {
    id: "action",
    header: "",
    align: "right",
    cell: (invoice) => (invoice.status === "UNPAID" ? <PayButton invoiceId={invoice.id} /> : null),
  },
];

const sum = (invoices: Invoice[], status: Invoice["status"]) =>
  invoices.filter((i) => i.status === status).reduce((total, i) => total + Number(i.amount), 0);

export function InvoicesView() {
  const params = useListParams({ filterKeys: ["status"] });
  const list = useListQuery<Invoice>("my-invoices", "invoices/my", params.query);
  // Totals come from one separate request so they do not change when the table is filtered.
  const totals = useListQuery<Invoice>("my-invoices-totals", "invoices/my", { limit: 50 });

  const all = totals.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {totals.isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard label="Outstanding" value={formatMoney(sum(all, "UNPAID"))} hint="Unpaid invoices" icon={Wallet} />
            <StatCard label="Paid so far" value={formatMoney(sum(all, "PAID"))} hint="Completed payments" icon={CircleCheck} />
            <StatCard label="Unpaid invoices" value={all.filter((i) => i.status === "UNPAID").length} hint="Need your attention" icon={FileText} />
          </>
        )}
      </div>

      <Card size="sm">
        <CardContent className="flex gap-3 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <p className="text-muted-foreground">
            You can only enroll in a semester after its invoice is paid. Payments are processed by SSLCommerz in{" "}
            <span className="font-medium text-foreground">sandbox mode</span>: use test card{" "}
            <span className="font-mono text-foreground">4111 1111 1111 1111</span>, expiry{" "}
            <span className="font-mono text-foreground">12/30</span>, CVV{" "}
            <span className="font-mono text-foreground">111</span> and OTP{" "}
            <span className="font-mono text-foreground">111111</span>. No real money is charged.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        <FilterSelect value={params.filters.status ?? ""} onChange={(value) => params.setFilter("status", value)} allLabel="All statuses" options={STATUS_OPTIONS} />
      </div>

      <DataTable
        columns={columns}
        rows={list.data?.data}
        getRowId={(invoice) => invoice.id}
        isLoading={list.isLoading}
        isFetching={list.isFetching}
        meta={list.data?.meta}
        onPageChange={params.setPage}
        onLimitChange={params.setLimit}
        empty={
          <EmptyState
            icon={FileText}
            title={params.hasActiveFilters ? "No invoices match this filter" : "No invoices yet"}
            description={params.hasActiveFilters ? "Try a different status." : "When the university issues a fee invoice, it will appear here."}
            action={params.hasActiveFilters ? <Button variant="outline" onClick={params.reset}>Clear filter</Button> : undefined}
          />
        }
      />
    </div>
  );
}