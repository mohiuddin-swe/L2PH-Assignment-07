"use client";

import { AttendanceTab } from "@/components/teacher/attendance-tab";
import { MarksTab } from "@/components/teacher/marks-tab";
import { StudentsTab } from "@/components/teacher/students-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function OfferingWorkspace({ offeringId }: { offeringId: string }) {
  return (
    <Tabs defaultValue="students" className="gap-4">
      <TabsList className="h-9 w-full sm:w-fit">
        <TabsTrigger value="students" className="sm:px-4">Students</TabsTrigger>
        <TabsTrigger value="attendance" className="sm:px-4">Attendance</TabsTrigger>
        <TabsTrigger value="marks" className="sm:px-4">Marks</TabsTrigger>
      </TabsList>
      <TabsContent value="students">
        <StudentsTab offeringId={offeringId} />
      </TabsContent>
      <TabsContent value="attendance">
        <AttendanceTab offeringId={offeringId} />
      </TabsContent>
      <TabsContent value="marks">
        <MarksTab offeringId={offeringId} />
      </TabsContent>
    </Tabs>
  );
}