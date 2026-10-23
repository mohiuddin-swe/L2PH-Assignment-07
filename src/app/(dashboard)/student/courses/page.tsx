import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { CoursesView } from "@/components/student/courses-view";

export const metadata: Metadata = { title: "Courses" };

export default function StudentCoursesPage() {
  return (
    <>
      <PageHeader title="Courses" description="Browse this semester's offerings and enroll. You need a paid semester invoice and at most 18 credits." />
      <CoursesView />
    </>
  );
}