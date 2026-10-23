"use client";

import { Receipt } from "lucide-react";
import Link from "next/link";
import { DataTable, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { FilterSelect } from "@/components/common/filter-select";
import { StatusBadge } from "@/components/common/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useListParams } from "@/hooks/use-list-params";
import { useListQuery } from "@/hooks/use-list-query";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { Payment } from "@/types/api";

const STATUS_OPTIONS = [
  { value: "SUCCESS", label: "Successful" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const columns: Column<Payment>[] = [
  {
    id: "invoice",
    header: "Invoice",
    cell: (payment) => (
      <div className="min-w-0">
        <p className="font-medium">{payment.invoice.title}</p>
        {payment.invoice.semester ? <p className="text-xs text-muted-foreground">{payment.invoice.semester}</p> : null}
      </div>
    ),
  },
  { id: "gateway", header: "Gateway", hideOnMobile: true, cell: (payment) => (payment.gateway === "SSLCOMMERZ" ? "SSLCommerz" : "Stripe") },
  {
    id: "transaction",
    header: "Transaction ID",
    hideOnMobile: true,
    cell: (payment) => <span className="font-mono text-xs">{payment.transactionId ?? "-"}</span>,
  },
  { id: "amount", header: "Amount", align: "right", className: "tabular-nums", cell: (payment) => formatMoney(payment.amount, payment.currency) },
  { id: "status", header: "Status", cell: (payment) => <StatusBadge status={payment.status} /> },
  { id: "date", header: "Date", hideOnMobile: true, cell: (payment) => formatDateTime(payment.paidAt ?? payment.createdAt) },
];

export function PaymentsView() {
  const params = useListParams({ filterKeys: ["status"] });
  const list = useListQuery<Payment>("my-payments", "payments/my", params.query);

  return (
    <div className="space-y-4">
      <FilterSelect value={params.filters.status ?? ""} onChange={(value) => params.setFilter("status", value)} allLabel="All statuses" options={STATUS_OPTIONS} />
      <DataTable
        columns={columns}
        rows={list.data?.data}
        getRowId={(payment) => payment.id}
        isLoading={list.isLoading}
        isFetching={list.isFetching}
        meta={list.data?.meta}
        onPageChange={params.setPage}
        onLimitChange={params.setLimit}
        empty={
          <EmptyState
            icon={Receipt}
            title={params.hasActiveFilters ? "No payments match this filter" : "No payments yet"}
            description={params.hasActiveFilters ? "Try a different status." : "Your payment attempts will be listed here once you pay an invoice."}
            action={
              params.hasActiveFilters ? (
                <Button variant="outline" onClick={params.reset}>Clear filter</Button>
              ) : (
                <Link href="/student/invoices" className={buttonVariants({ variant: "outline" })}>View invoices</Link>
              )
            }
          />
        }
      />
    </div>
  );
}