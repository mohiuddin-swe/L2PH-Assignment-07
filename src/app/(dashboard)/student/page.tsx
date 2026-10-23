import { BookOpen, CalendarCheck, GraduationCap, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { StatusBadge } from "@/components/common/status-badge";
import { GpaChart } from "@/components/student/gpa-chart";
import { NoticeList } from "@/components/student/dashboard-notices";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet, apiGetList } from "@/lib/api-server";
import { firstName, formatMoney } from "@/lib/format";
import type { Invoice, MyAttendance, MyEnrollment, MyResults, Notice, Profile } from "@/types/api";

export const metadata: Metadata = { title: "Dashboard" };

export default async function StudentHomePage() {
  // All six requests run in parallel on the server.
  const [user, results, attendance, enrollments, unpaid, notices] = await Promise.all([
    apiGet<Profile>("users/me"),
    apiGet<MyResults>("results/my"),
    apiGet<MyAttendance[]>("attendance/my"),
    apiGetList<MyEnrollment>("enrollments/my", { limit: 50 }),
    apiGetList<Invoice>("invoices/my", { status: "UNPAID", limit: 5 }),
    apiGetList<Notice>("notices", { limit: 4 }),
  ]);

  const current = enrollments.data.filter((enrollment) => enrollment.status === "ENROLLED");
  const tracked = attendance.filter((item) => item.summary.totalClasses > 0);
  const averageAttendance = tracked.length ? tracked.reduce((total, item) => total + item.summary.percentage, 0) / tracked.length : null;
  const unpaidTotal = unpaid.data.reduce((total, invoice) => total + Number(invoice.amount), 0);

  return (
    <>
      <PageHeader title={`Welcome back, ${firstName(user.name)}`} description={user.studentProfile ? `Student ID ${user.studentProfile.studentId}` : "Here is your academic summary."} />

      {unpaid.meta.total > 0 ? (
        <Card size="sm" className="mb-6 bg-warning/15 ring-warning/40">
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning-foreground dark:text-warning" aria-hidden />
              <span>
                You have <span className="font-semibold">{unpaid.meta.total} unpaid invoice{unpaid.meta.total === 1 ? "" : "s"}</span>
                {unpaid.data.length === unpaid.meta.total ? ` totalling ${formatMoney(unpaidTotal)}` : ""}. You cannot enroll in a semester until its invoice is paid.
              </span>
            </p>
            <Link href="/student/invoices" className={buttonVariants({ size: "sm" })}>
              Pay now
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="CGPA" value={results.results.length ? results.cgpa.toFixed(2) : "-"} hint="Out of 4.00" icon={GraduationCap} />
        <StatCard label="Credits earned" value={results.totalCredits} hint="From published results" icon={BookOpen} />
        <StatCard label="Current courses" value={current.length} hint="Active enrollments" icon={BookOpen} />
        <StatCard label="Avg. attendance" value={averageAttendance === null ? "-" : `${averageAttendance.toFixed(0)}%`} hint={tracked.length ? `Across ${tracked.length} course${tracked.length === 1 ? "" : "s"}` : "No classes yet"} icon={CalendarCheck} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current courses</CardTitle>
              <CardDescription>Courses you are enrolled in right now.</CardDescription>
            </CardHeader>
            <CardContent>
              {current.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No active enrollments"
                  description="Enroll in this semester's courses to see them here."
                  className="py-8"
                  action={
                    <Link href="/student/courses" className={buttonVariants({ variant: "outline" })}>
                      Browse courses
                    </Link>
                  }
                />
              ) : (
                <ul className="divide-y">
                  {current.map((enrollment) => (
                    <li key={enrollment.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {enrollment.offering.course.code} · {enrollment.offering.course.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {enrollment.offering.teacher.name} · {enrollment.offering.semester} · {enrollment.offering.course.credit} credits
                        </p>
                      </div>
                      <StatusBadge status={enrollment.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {results.semesters.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>GPA by semester</CardTitle>
                <CardDescription>
                  <Link href="/student/results" className="text-primary underline-offset-4 hover:underline">
                    See full results
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GpaChart data={results.semesters} />
              </CardContent>
            </Card>
          ) : null}
        </div>

        <NoticeList notices={notices.data} />
      </div>
    </>
  );
}