import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { APP_NAME } from "@/lib/config";
import { SITE_LINKS } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">One portal for enrollment, attendance, results and fees.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {SITE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
        </nav>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. Built with Next.js, TypeScript and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
