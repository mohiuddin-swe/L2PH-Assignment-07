import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { ProfileView } from "@/components/profile/profile-view";
import { apiGet } from "@/lib/api-server";
import type { Profile } from "@/types/api";

export const metadata: Metadata = { title: "Profile" };

export default async function AdminProfilePage() {
  const user = await apiGet<Profile>("users/me");
  return (
    <>
      <PageHeader title="Profile" description="Your account details." />
      <ProfileView user={user} />
    </>
  );
}