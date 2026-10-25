import { BookOpenCheck, CreditCard, GraduationCap, LineChart, ShieldCheck, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: { absolute: `${APP_NAME} | University Management System` },
  description: "Enroll in courses, track attendance, see results and GPA, and pay fees online. One portal for students, teachers and administrators.",
  alternates: { canonical: "/" },
};

const ROLES = [
  {
    icon: GraduationCap,
    title: "For students",
    description: "Enroll in courses, follow attendance, read published results and your CGPA, and pay semester fees online.",
    points: ["Seat-aware enrollment", "Attendance with 75% warnings", "Secure SSLCommerz payments"],
  },
  {
    icon: BookOpenCheck,
    title: "For teachers",
    description: "Take attendance in one click, enter marks, and publish results when they are ready.",
    points: ["Bulk attendance marking", "Draft then publish marks", "Class notices"],
  },
  {
    icon: LineChart,
    title: "For administrators",
    description: "See users, enrollments and revenue on one dashboard, and set up offerings, invoices and accounts.",
    points: ["Live analytics charts", "Offering setup wizard", "Audit log of every change"],
  },
];

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Role-based access", text: "Every page is protected on the server for the right role." },
  { icon: CreditCard, label: "Real online payments", text: "Fees are paid through the SSLCommerz gateway and verified by the backend." },
  { icon: Users, label: "Built for the whole campus", text: "Students, teachers and admins each get a dashboard made for their work." },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">University Management System</p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Everything your campus needs, in one portal.</h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Enroll in courses, track attendance, read results and GPA, and pay fees online. {APP_NAME} gives students, teachers and administrators a dashboard built for their work.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className={buttonVariants({ size: "lg" })}>
              Try the live demo
            </Link>
            <Link href="/register" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Create an account
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">The sign-in page has one-click demo accounts for a student, a teacher and an admin.</p>
        </div>
        <Image
          src="/hero.svg"
          alt="Illustration of a university dashboard with a GPA chart and course cards"
          width={640}
          height={420}
          priority
          className="h-auto w-full rounded-2xl ring-1 ring-foreground/10"
        />
      </section>

      <section aria-labelledby="roles-heading" className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-14">
          <div className="max-w-2xl space-y-2">
            <h2 id="roles-heading" className="text-2xl font-semibold tracking-tight">A workspace for every role</h2>
            <p className="text-muted-foreground">Sign in once and land on the dashboard that matches your role.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {ROLES.map((role) => (
              <Card key={role.title}>
                <CardHeader>
                  <span className="mb-2 grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <role.icon className="size-5" aria-hidden />
                  </span>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm">
                    {role.points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="why-heading" className="mx-auto max-w-6xl space-y-8 px-4 py-14">
        <h2 id="why-heading" className="text-2xl font-semibold tracking-tight">Built to be trusted</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className="flex gap-3">
              <item.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <h3 className="font-medium">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
