import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { WelcomeCard } from "@/components/layout/welcome-card";

export const metadata: Metadata = { title: "Student dashboard" };

export default function StudentHomePage() {
  return (
    <>
      <PageHeader title="Student dashboard" description="Your courses, attendance, results and fees." />
      <WelcomeCard />
    </>
  );
}