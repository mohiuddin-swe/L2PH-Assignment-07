import type { Metadata } from "next";
import { NoticesView } from "@/components/notices/notices-view";

export const metadata: Metadata = { title: "Notices" };

export default function AdminNoticesPage() {
  return <NoticesView />;
}
