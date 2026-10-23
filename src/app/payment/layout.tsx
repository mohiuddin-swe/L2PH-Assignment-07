import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";

// Payment result pages are personal, so keep them out of search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <header className="flex items-center justify-between p-4 sm:p-6">
        <Logo href="/student" />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-12">{children}</main>
    </div>
  );
}