import { Award, BookCheck, GraduationCap, Library } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { StatCard } from "@/components/common/stat-card";
import { GpaChart } from "@/components/student/gpa-chart";
import { GradeBadge } from "@/components/student/grade-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import type { MyResults } from "@/types/api";

export function ResultsView({ data }: { data: MyResults }) {
  if (data.results.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Award}
          title="No published results yet"
          description="Results appear here after your teachers publish them at the end of a semester."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="CGPA" value={data.cgpa.toFixed(2)} hint="Out of 4.00" icon={GraduationCap} />
        <StatCard label="Credits earned" value={data.totalCredits} hint="Across all semesters" icon={Library} />
        <StatCard label="Courses completed" value={data.results.length} hint={`${data.semesters.length} semester${data.semesters.length === 1 ? "" : "s"}`} icon={BookCheck} />
      </div>

      {data.semesters.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>GPA by semester</CardTitle>
            <CardDescription>Credit-weighted GPA on the 4.00 scale.</CardDescription>
          </CardHeader>
          <CardContent>
            <GpaChart data={data.semesters} />
          </CardContent>
        </Card>
      ) : null}

      {data.semesters.map((semester) => {
        const rows = data.results.filter((result) => result.semester === semester.semester);
        return (
          <Card key={semester.semester}>
            <CardHeader className="border-b">
              <CardTitle>{semester.semester}</CardTitle>
              <CardDescription>
                GPA <span className="font-semibold text-foreground">{semester.gpa.toFixed(2)}</span> from {semester.totalCredits} credits
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-4">Course</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Marks</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">Points</TableHead>
                    <TableHead className="hidden pr-4 text-right md:table-cell">Published</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((result) => (
                    <TableRow key={result.offeringId}>
                      <TableCell className="pl-4">
                        <p className="font-medium">{result.course.code}</p>
                        <p className="text-xs text-muted-foreground">{result.course.title}</p>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{result.course.credit}</TableCell>
                      <TableCell className="text-right tabular-nums">{result.marks}</TableCell>
                      <TableCell className="text-center">
                        <GradeBadge grade={result.grade} />
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums sm:table-cell">{result.gradePoint.toFixed(2)}</TableCell>
                      <TableCell className="hidden pr-4 text-right text-muted-foreground md:table-cell">{formatDate(result.publishedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}