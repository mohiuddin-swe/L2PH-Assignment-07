import type { Metadata } from "next";
import { OfferingsView } from "@/components/admin/offerings-view";

export const metadata: Metadata = { title: "Academics" };

export default function AdminAcademicsPage() {
  return <OfferingsView />;
}
