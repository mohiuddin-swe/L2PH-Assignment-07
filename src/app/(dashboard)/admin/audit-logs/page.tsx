import type { Metadata } from "next";
import { AuditLogsView } from "@/components/admin/audit-logs-view";

export const metadata: Metadata = { title: "Audit logs" };

export default function AdminAuditLogsPage() {
  return <AuditLogsView />;
}
