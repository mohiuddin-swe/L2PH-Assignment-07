import type { Metadata } from "next";
import Link from "next/link";
import { PublicHero, PublicSection } from "@/components/layout/public-section";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: `${APP_NAME} is a role-based university management system with real online fee payment. Learn what it does and how it is built.`,
  alternates: { canonical: "/about" },
};

const STACK = [
  { title: "Frontend", items: "Next.js App Router, React Server Components, TypeScript in strict mode, Tailwind CSS and shadcn/ui" },
  { title: "Data and forms", items: "TanStack Query for server data, Zustand for the signed-in user, React Hook Form with Zod for validation" },
  { title: "Backend", items: "A REST API on Node.js with PostgreSQL and Prisma, JWT access tokens with rotating refresh tokens" },
  { title: "Payments", items: "SSLCommerz hosted checkout. The backend verifies every payment before an invoice is marked paid" },
];

export default function AboutPage() {
  return (
    <>
      <PublicHero
        eyebrow="About"
        title="A university portal that keeps students, teachers and admins on the same page"
        description={`${APP_NAME} replaces scattered spreadsheets and paper notices with one system that each person signs in to and uses for their own work.`}
      />

      <PublicSection title="What it does">
        <div className="grid gap-6 md:grid-cols-2">
          <p className="text-muted-foreground">
            Students enroll in the courses offered each semester, follow their attendance, read published results and see their CGPA. Fees are paid online, and the system makes sure a semester is paid
            for before enrollment opens.
          </p>
          <p className="text-muted-foreground">
            Teachers take attendance, enter marks and publish results for their classes. Administrators manage accounts, departments, courses and offerings, create invoices and watch the numbers on a
            live dashboard, with an audit log of every important change.
          </p>
        </div>
      </PublicSection>

      <section className="border-y bg-muted/40">
        <PublicSection title="How it is built">
          <div className="grid gap-4 sm:grid-cols-2">
            {STACK.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.items}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </PublicSection>
      </section>

      <PublicSection title="Security by design">
        <Card>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Sign-in tokens are kept in httpOnly cookies, so page scripts can never read them. Every request to the API goes through the Next.js server.</p>
            <p>Each page checks your role on the server before it renders. A student cannot open a teacher or admin page, even by typing the address.</p>
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-3">
          <Link href="/login" className={buttonVariants()}>
            Try the demo
          </Link>
          <Link href="/features" className={buttonVariants({ variant: "outline" })}>
            See all features
          </Link>
        </div>
      </PublicSection>
    </>
  );
}
