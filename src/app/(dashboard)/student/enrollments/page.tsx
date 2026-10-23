import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { EnrollmentsView } from "@/components/student/enrollments-view";

export const metadata: Metadata = { title: "My enrollments" };

export default function StudentEnrollmentsPage() {
  return (
    <>
      <PageHeader title="My enrollments" description="Every course you have enrolled in." />
      <EnrollmentsView />
    </>
  );
}