import type { Metadata } from "next";
import { AdminInvoicesView } from "@/components/admin/invoices-view";

export const metadata: Metadata = { title: "Invoices" };

export default function AdminInvoicesPage() {
  return <AdminInvoicesView />;
}
