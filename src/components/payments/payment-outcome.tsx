"use client";

import { useQuery } from "@tanstack/react-query";
import { Ban, CircleCheck, CircleX, Clock, Loader2, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StatusBadge } from "@/components/common/status-badge";
import { PayButton } from "@/components/payments/pay-button";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { formatDateTime, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Payment } from "@/types/api";

type Variant = "success" | "fail" | "cancel";

// The gateway sends the student here only after the backend has verified the payment on its own
// (server to server), so the URL alone proves nothing. We read the real status from the API instead.
export function PaymentOutcome({ variant }: { variant: Variant }) {
  const params = useSearchParams();
  const tranId = params.get("tran_id");
  const reason = params.get("reason");

  const { data: payment, isLoading } = useQuery({
    queryKey: ["payment-by-transaction", tranId],
    enabled: Boolean(tranId),
    queryFn: async ({ signal }) => {
      const list = await api.list<Payment>("payments/my", { limit: 50 }, signal);
      return list.data.find((item) => item.transactionId === tranId) ?? null;
    },
    // The status can lag a moment behind the redirect, so keep checking while it is pending.
    refetchInterval: (query) => {
      const found = query.state.data;
      return query.state.dataUpdateCount < 8 && (!found || found.status === "PENDING") ? 3000 : false;
    },
  });

  const status = payment?.status;
  const confirmed = variant === "success" && status === "SUCCESS";
  const waiting = variant === "success" && (!payment || status === "PENDING");

  let view: { icon: LucideIcon; tone: string; title: string; text: string };
  if (confirmed) {
    view = { icon: CircleCheck, tone: "bg-success/15 text-success", title: "Payment successful", text: "Thank you. Your invoice has been marked as paid and you can now enroll in courses for that semester." };
  } else if (waiting) {
    view = { icon: Clock, tone: "bg-warning/25 text-warning-foreground dark:text-warning", title: "Confirming your payment", text: "We are waiting for the bank to confirm. This usually takes a few seconds." };
  } else if (variant === "cancel" || status === "CANCELLED") {
    view = { icon: Ban, tone: "bg-muted text-muted-foreground", title: "Payment cancelled", text: "You cancelled the payment. Nothing was charged and your invoice is still unpaid." };
  } else {
    view = { icon: CircleX, tone: "bg-destructive/10 text-destructive", title: "Payment failed", text: reason ? `The payment could not be completed: ${reason}.` : "The payment could not be completed. Nothing was charged." };
  }
  const Icon = view.icon;
  const canRetry = payment && !confirmed && !waiting;

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className={cn("grid size-16 place-items-center rounded-full", view.tone)}>
          {waiting ? <Loader2 className="size-8 animate-spin" aria-hidden /> : <Icon className="size-8" aria-hidden />}
        </span>
        <div className="space-y-1.5" role="status" aria-live="polite">
          <h1 className="text-2xl font-semibold tracking-tight">{view.title}</h1>
          <p className="text-sm text-muted-foreground">{view.text}</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-3 text-sm">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : payment ? (
            <dl className="space-y-3">
              <Row label="Invoice" value={payment.invoice.title} />
              {payment.invoice.semester ? <Row label="Semester" value={payment.invoice.semester} /> : null}
              <Row label="Amount" value={formatMoney(payment.amount, payment.currency)} />
              <Row label="Status" value={<StatusBadge status={payment.status} />} />
              <Row label="Transaction ID" value={<span className="font-mono text-xs break-all">{payment.transactionId}</span>} />
              <Row label={payment.paidAt ? "Paid at" : "Started at"} value={formatDateTime(payment.paidAt ?? payment.createdAt)} />
            </dl>
          ) : (
            <p className="text-muted-foreground">
              {tranId ? "We could not find this payment yet." : "No transaction was provided."} Check your payment history for the latest status.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        {canRetry ? <PayButton invoiceId={payment.invoiceId} label="Try again" /> : null}
        <Link href="/student/invoices" className={buttonVariants({ variant: confirmed ? "default" : "outline" })}>
          Back to invoices
        </Link>
        <Link href="/student/payments" className={buttonVariants({ variant: "outline" })}>
          Payment history
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}