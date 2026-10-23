"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayInvoice } from "@/hooks/use-pay-invoice";

export function PayButton({ invoiceId, label = "Pay now" }: { invoiceId: string; label?: string }) {
  const pay = usePayInvoice();
  const busy = pay.isPending || pay.isSuccess;
  return (
    <Button size="sm" disabled={busy} onClick={() => pay.mutate(invoiceId)}>
      {busy ? <Loader2 className="animate-spin" aria-hidden /> : <CreditCard aria-hidden />}
      {busy ? "Redirecting..." : label}
    </Button>
  );
}