"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteNav({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Pages" className={cn("flex items-center gap-1", className)}>
      {SITE_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname === link.href ? "page" : undefined}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors hover:bg-muted hover:text-foreground",
            pathname === link.href ? "bg-muted text-foreground" : "text-muted-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
