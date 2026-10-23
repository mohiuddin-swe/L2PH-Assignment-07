import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { PaymentsView } from "@/components/payments/payments-view";

export const metadata: Metadata = { title: "Payment history" };

export default function StudentPaymentsPage() {
  return (
    <>
      <PageHeader title="Payment history" description="Every payment attempt and its result." />
      <PaymentsView />
    </>
  );
}