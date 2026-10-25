import { BookOpen, Library, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { NoticeList } from "@/components/student/dashboard-notices";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet, apiGetList } from "@/lib/api-server";
import { firstName } from "@/lib/format";
import type { Notice, Offering, Profile } from "@/types/api";

export const metadata: Metadata = { title: "Dashboard" };

export default async function TeacherHomePage() {
  const [user, classes, notices] = await Promise.all([
    apiGet<Profile>("users/me"),
    apiGetList<Offering>("offerings/my-assigned", { limit: 50 }),
    apiGetList<Notice>("notices", { limit: 4 }),
  ]);

  const students = classes.data.reduce((total, offering) => total + offering.enrolledCount, 0);
  const credits = classes.data.reduce((total, offering) => total + offering.course.credit, 0);

  return (
    <>
      <PageHeader
        title={`Welcome, ${firstName(user.name)}`}
        description={user.teacherProfile ? [user.teacherProfile.designation, user.teacherProfile.department?.name].filter(Boolean).join(" · ") : "Here is your teaching summary."}
        actions={
          <Link href="/teacher/classes" className={buttonVariants({ variant: "outline" })}>
            All classes
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Assigned classes" value={classes.meta.total} hint="Course offerings" icon={BookOpen} />
        <StatCard label="Enrolled students" value={students} hint="Across your classes" icon={Users} />
        <StatCard label="Teaching credits" value={credits} hint="Sum of course credits" icon={Library} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your classes</CardTitle>
            <CardDescription>Open a class to take attendance and enter marks.</CardDescription>
          </CardHeader>
          <CardContent>
            {classes.data.length === 0 ? (
              <EmptyState icon={BookOpen} title="No classes assigned yet" description="An admin will assign course offerings to you." className="py-8" />
            ) : (
              <ul className="divide-y">
                {classes.data.slice(0, 6).map((offering) => (
                  <li key={offering.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {offering.course.code} · {offering.course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {offering.semester} · Section {offering.section} · {offering.enrolledCount} students
                      </p>
                    </div>
                    <Link href={`/teacher/offerings/${offering.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      Open
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <NoticeList notices={notices.data} />
      </div>
    </>
  );
}