import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { ResultsView } from "@/components/student/results-view";
import { apiGet } from "@/lib/api-server";
import type { MyResults } from "@/types/api";

export const metadata: Metadata = { title: "Results" };

export default async function StudentResultsPage() {
  const data = await apiGet<MyResults>("results/my");
  return (
    <>
      <PageHeader title="Results" description="Published grades, semester GPA and your CGPA." />
      <ResultsView data={data} />
    </>
  );
}