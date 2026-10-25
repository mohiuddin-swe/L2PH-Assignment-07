import type { Metadata } from "next";
import { AcademicsView } from "@/components/admin/academics-view";

export const metadata: Metadata = { title: "Academics" };

export default function AdminAcademicsPage() {
  return <AcademicsView />;
}
