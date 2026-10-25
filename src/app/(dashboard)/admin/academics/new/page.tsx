import type { Metadata } from "next";
import { OfferingWizard } from "@/components/admin/offering-wizard";
import { PageHeader } from "@/components/common/page-header";

export const metadata: Metadata = { title: "Create offering" };

export default function CreateOfferingPage() {
  return (
    <>
      <PageHeader title="Create offering" description="Open a course for a semester in three steps." />
      <OfferingWizard />
    </>
  );
}
