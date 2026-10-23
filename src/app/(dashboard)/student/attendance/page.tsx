import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { AttendanceView } from "@/components/student/attendance-view";
import { apiGet } from "@/lib/api-server";
import type { MyAttendance } from "@/types/api";

export const metadata: Metadata = { title: "Attendance" };

export default async function StudentAttendancePage() {
  const items = await apiGet<MyAttendance[]>("attendance/my");
  return (
    <>
      <PageHeader title="Attendance" description="Your attendance in every course. Keep it at 75% or above." />
      <AttendanceView items={items} />
    </>
  );
}