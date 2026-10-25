import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { ClassesView } from "@/components/teacher/classes-view";

export const metadata: Metadata = { title: "My classes" };

export default function TeacherClassesPage() {
  return (
    <>
      <PageHeader title="My classes" description="Course offerings assigned to you. Open one to take attendance and manage marks." />
      <ClassesView />
    </>
  );
}