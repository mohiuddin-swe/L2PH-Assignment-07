import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { WelcomeCard } from "@/components/layout/welcome-card";

export const metadata: Metadata = { title: "Admin dashboard" };

export default function AdminHomePage() {
  return (
    <>
      <PageHeader title="Admin dashboard" description="Users, academics and finance at a glance." />
      <WelcomeCard />
    </>
  );
}