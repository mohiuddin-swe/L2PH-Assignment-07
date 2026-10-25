import { BookOpen, Banknote, Percent, Users } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { InvoiceStatusChart, SeatsChart, UsersByRoleChart } from "@/components/admin/admin-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/lib/api-server";
import type { AdminStats } from "@/types/api";

export const metadata: Metadata = { title: "Admin dashboard" };

const ROLE_ORDER = ["STUDENT", "TEACHER", "ADMIN"] as const;
const INVOICE_ORDER = ["UNPAID", "PAID", "CANCELLED"] as const;

const compactMoney = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", notation: "compact", maximumFractionDigits: 1 });

export default async function AdminHomePage() {
  const stats = await apiGet<AdminStats>("admin/stats");

  const roles = ROLE_ORDER.map((role) => ({ role, count: stats.users.byRole[role] ?? 0 }));
  const invoices = INVOICE_ORDER.map((status) => ({
    status,
    count: stats.finance.invoices[status]?.count ?? 0,
    amount: Number(stats.finance.invoices[status]?.amount ?? 0),
  }));
  const seats = stats.topOfferings.map((offering) => ({
    name: offering.course.code,
    enrolled: offering.enrolledCount,
    free: Math.max(0, offering.capacity - offering.enrolledCount),
  }));

  return (
    <>
      <PageHeader title="Admin dashboard" description="Users, academics and finance at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={stats.users.total} hint={`${stats.users.joinedLast7Days} joined in the last 7 days`} icon={Users} />
        <StatCard label="Revenue" value={compactMoney.format(Number(stats.finance.revenue))} hint={`${stats.finance.successfulPayments} successful payments`} icon={Banknote} />
        <StatCard label="Active enrollments" value={stats.academics.activeEnrollments} hint={`${stats.academics.offerings} offerings, ${stats.academics.courses} courses`} icon={BookOpen} />
        <StatCard label="Seat utilization" value={`${stats.academics.seatUtilizationPercent}%`} hint={`${stats.academics.filledSeats} of ${stats.academics.totalSeats} seats filled`} icon={Percent} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Users by role</CardTitle>
            <CardDescription>{stats.users.suspended} suspended account{stats.users.suspended === 1 ? "" : "s"}.</CardDescription>
          </CardHeader>
          <CardContent>
            <UsersByRoleChart data={roles} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Invoices by status</CardTitle>
            <CardDescription>Total amount in BDT. {stats.finance.pendingPayments} payment{stats.finance.pendingPayments === 1 ? "" : "s"} pending.</CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceStatusChart data={invoices} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Most popular offerings</CardTitle>
            <CardDescription>Enrolled students against free seats.</CardDescription>
          </CardHeader>
          <CardContent>{seats.length > 0 ? <SeatsChart data={seats} /> : <p className="py-10 text-center text-sm text-muted-foreground">No offerings yet.</p>}</CardContent>
        </Card>
      </div>
    </>
  );
}
