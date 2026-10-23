"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/common/logo";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/constants";
import { NAV, isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/api";

interface SidebarContentProps {
  role: Role;
  /** Called after a link is clicked (used to close the mobile drawer). */
  onNavigate?: () => void;
}

export function SidebarContent({ role, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center border-b px-4">
        <Logo href={ROLE_HOME[role]} />
      </div>
      <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 pb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
          {ROLE_LABEL[role]}
        </p>
        {NAV[role].map((item) => {
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <p className="shrink-0 border-t p-4 text-xs text-muted-foreground">University Management System</p>
    </div>
  );
}