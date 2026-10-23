"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { InitiatedPayment } from "@/types/api";

// Starts a real SSLCommerz payment: the backend creates the payment and returns the hosted
// gateway URL, then we send the student there. The gateway sends them back to /payment/success,
// /payment/fail or /payment/cancel after the backend has verified the result.
export function usePayInvoice() {
  return useMutation({
    mutationFn: async (invoiceId: string) => (await api.post<InitiatedPayment>("payments/initiate", { invoiceId })).data,
    onSuccess: (payment) => {
      toast.loading("Redirecting to the secure payment page...");
      window.location.assign(payment.gatewayUrl);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not start the payment"),
  });
}