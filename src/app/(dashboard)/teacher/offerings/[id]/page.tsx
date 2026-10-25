import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { OfferingWorkspace } from "@/components/teacher/offering-workspace";
import { buttonVariants } from "@/components/ui/button";
import { ApiError } from "@/lib/api-error";
import { apiGet } from "@/lib/api-server";
import type { Offering } from "@/types/api";

export const metadata: Metadata = { title: "Class" };

async function loadOffering(id: string): Promise<Offering> {
  try {
    return await apiGet<Offering>(`offerings/${id}`);
  } catch (error) {
    // A malformed id (400) or an offering that does not exist (404) both end up on the 404 page.
    if (error instanceof ApiError && (error.status === 400 || error.status === 404)) notFound();
    throw error;
  }
}

export default async function TeacherOfferingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offering = await loadOffering(id);

  return (
    <>
      <Link href="/teacher/classes" className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-3 -ml-2" })}>
        <ArrowLeft aria-hidden />
        My classes
      </Link>
      <PageHeader
        title={`${offering.course.code} · ${offering.course.title}`}
        description={`${offering.semester} · Section ${offering.section} · ${offering.enrolledCount} of ${offering.capacity} seats filled · ${offering.course.credit} credits`}
      />
      <OfferingWorkspace offeringId={offering.id} />
    </>
  );
}