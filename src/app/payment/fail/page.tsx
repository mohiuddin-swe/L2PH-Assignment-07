import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentOutcome } from "@/components/payments/payment-outcome";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Payment failed" };

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full max-w-md rounded-xl" />}>
      <PaymentOutcome variant="fail" />
    </Suspense>
  );
}