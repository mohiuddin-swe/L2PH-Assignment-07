import { BarChart3, CalendarCheck, ClipboardList, CreditCard, Megaphone, Trophy } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PublicHero, PublicSection } from "@/components/layout/public-section";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Features",
  description: "Enrollment with seat limits, attendance, results and CGPA, real online fee payment, notices and an admin analytics dashboard.",
  alternates: { canonical: "/features" },
};

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Enrollment",
    text: "Browse the offerings of a semester and enroll in one click. Seats are limited, a semester can hold at most 18 credits, and the unpaid-fee check runs before a seat is taken.",
    audience: "Students",
  },
  {
    icon: CalendarCheck,
    title: "Attendance",
    text: "Teachers mark a whole class in one go and can correct a day later. Students see their percentage per course and a warning when it falls below 75%.",
    audience: "Teachers and students",
  },
  {
    icon: Trophy,
    title: "Results and CGPA",
    text: "Marks stay as a draft until the teacher publishes them. Once published they cannot be changed, and students see grades, semester GPA and a credit-weighted CGPA.",
    audience: "Teachers and students",
  },
  {
    icon: CreditCard,
    title: "Online fee payment",
    text: "Students pay semester invoices through the SSLCommerz checkout. The backend confirms each payment with the gateway before the invoice is marked paid.",
    audience: "Students and admins",
  },
  {
    icon: Megaphone,
    title: "Notices",
    text: "Teachers and admins post announcements that every signed-in user can read, with search and the ability to edit or remove their own posts.",
    audience: "Everyone",
  },
  {
    icon: BarChart3,
    title: "Admin analytics",
    text: "A dashboard with charts for users by role, invoices by status and the most popular offerings, plus user management and a full audit log.",
    audience: "Admins",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PublicHero
        eyebrow="Features"
        title="Everything a semester needs, from enrollment to results"
        description={`${APP_NAME} covers the full life of a course: opening it, enrolling, teaching it, grading it and getting paid for it.`}
      />
      <PublicSection>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <span className="mb-2 grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" aria-hidden />
                </span>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.audience}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/login" className={buttonVariants()}>
            Try it with a demo account
          </Link>
          <Link href="/faq" className={buttonVariants({ variant: "outline" })}>
            Read the FAQ
          </Link>
        </div>
      </PublicSection>
    </>
  );
}
