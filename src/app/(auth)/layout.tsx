import { CalendarCheck, CreditCard, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { BackendStatus } from "@/components/auth/backend-status";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: "Role-based access", text: "Separate workspaces for administrators, teachers and students." },
  { icon: CalendarCheck, title: "Attendance and results", text: "Daily attendance, published grades and live GPA tracking." },
  { icon: CreditCard, title: "Secure fee payment", text: "Pay semester invoices online through the SSLCommerz gateway." },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,oklch(1_0_0/0.18),transparent_45%),radial-gradient(circle_at_10%_95%,oklch(0.2_0.1_268/0.55),transparent_50%)]"
        />
        <Logo variant="inverse" className="relative" />
        <div className="relative max-w-md space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl leading-tight font-semibold tracking-tight">One place for the whole campus.</h1>
            <p className="text-primary-foreground/75">
              From enrollment to final results, UniManage keeps students, teachers and administrators on the same page.
            </p>
          </div>
          <ul className="space-y-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-foreground/15">
                  <Icon className="size-4.5" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-primary-foreground/70">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-primary-foreground/60">University Management System</p>
      </aside>

      <div className="flex min-h-svh flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Logo className="lg:invisible" />
          <ThemeToggle />
        </div>
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-8 sm:px-0">{children}</main>
        <div className="p-4 sm:p-6">
          <BackendStatus />
        </div>
      </div>
    </div>
  );
}