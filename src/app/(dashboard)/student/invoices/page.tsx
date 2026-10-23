import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { InvoicesView } from "@/components/payments/invoices-view";

export const metadata: Metadata = { title: "Invoices" };

export default function StudentInvoicesPage() {
  return (
    <>
      <PageHeader title="Invoices" description="Semester fees and other charges. Pay online with SSLCommerz." />
      <InvoicesView />
    </>
  );
}