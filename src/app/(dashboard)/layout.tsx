import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthHydrator } from "@/components/layout/auth-hydrator";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { apiGet } from "@/lib/api-server";
import type { Profile } from "@/types/api";

// Signed-in pages are private, so keep them out of search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await apiGet<Profile>("users/me");
  return (
    <DashboardShell user={user}>
      <AuthHydrator user={user} />
      {children}
    </DashboardShell>
  );
}