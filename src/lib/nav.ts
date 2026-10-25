import {
  Award,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  Library,
  LayoutDashboard,
  Megaphone,
  Receipt,
  ScrollText,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types/api";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Only highlight on an exact path match (used for dashboard home links). */
  exact?: boolean;
}

export const NAV: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Academics", href: "/admin/academics", icon: Library },
    { label: "Invoices", href: "/admin/invoices", icon: Receipt },
    { label: "Notices", href: "/admin/notices", icon: Megaphone },
    { label: "Audit logs", href: "/admin/audit-logs", icon: ScrollText },
    { label: "Profile", href: "/admin/profile", icon: UserRound },
  ],
   TEACHER: [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard, exact: true },
    { label: "My classes", href: "/teacher/classes", icon: BookOpen },
    { label: "Notices", href: "/teacher/notices", icon: Megaphone },
    { label: "Profile", href: "/teacher/profile", icon: UserRound },
  ],
  STUDENT: [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard, exact: true },
    { label: "Courses", href: "/student/courses", icon: BookOpen },
    { label: "Enrollments", href: "/student/enrollments", icon: ClipboardList },
    { label: "Attendance", href: "/student/attendance", icon: CalendarCheck },
    { label: "Results", href: "/student/results", icon: Award },
    { label: "Invoices", href: "/student/invoices", icon: Wallet },
    { label: "Payment history", href: "/student/payments", icon: CreditCard },
    { label: "Profile", href: "/student/profile", icon: UserRound },
  ],
};

export function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}