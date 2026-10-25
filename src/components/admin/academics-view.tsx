"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CoursesView } from "@/components/admin/courses-view";
import { DepartmentsView } from "@/components/admin/departments-view";
import { OfferingsView } from "@/components/admin/offerings-view";
import { PageHeader } from "@/components/common/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = ["offerings", "courses", "departments"] as const;
type Tab = (typeof TABS)[number];

// The active tab lives in the URL (?tab=courses), so a refresh or a shared link keeps the view.
export function AcademicsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get("tab");
  const tab: Tab = TABS.find((item) => item === requested) ?? "offerings";

  return (
    <>
      <PageHeader
        title="Academics"
        description="Offerings, courses and departments."
        actions={
          <Link href="/admin/academics/new" className={buttonVariants()}>
            <Plus aria-hidden />
            Create offering
          </Link>
        }
      />
      <Tabs value={tab} onValueChange={(value) => router.replace(`${pathname}?tab=${value}`, { scroll: false })} className="gap-4">
        <TabsList className="h-9 w-full sm:w-fit">
          <TabsTrigger value="offerings" className="sm:px-4">Offerings</TabsTrigger>
          <TabsTrigger value="courses" className="sm:px-4">Courses</TabsTrigger>
          <TabsTrigger value="departments" className="sm:px-4">Departments</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Only the active tab is mounted, so each one starts with clean list filters. */}
      {tab === "offerings" ? <OfferingsView /> : tab === "courses" ? <CoursesView /> : <DepartmentsView />}
    </>
  );
}
