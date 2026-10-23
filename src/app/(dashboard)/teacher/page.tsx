import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { WelcomeCard } from "@/components/layout/welcome-card";

export const metadata: Metadata = { title: "My classes" };

export default function TeacherHomePage() {
  return (
    <>
      <PageHeader title="My classes" description="Your assigned course offerings." />
      <WelcomeCard />
    </>
  );
}