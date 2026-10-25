import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { SiteNav } from "@/components/layout/site-nav";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Logo />
          <SiteNav className="hidden md:flex" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Sign in
          </Link>
          <Link href="/register" className={buttonVariants({ size: "sm" })}>
            Get started
          </Link>
        </div>
      </div>
      <SiteNav className="mx-auto max-w-6xl overflow-x-auto px-3 pb-2 md:hidden" />
    </header>
  );
}
