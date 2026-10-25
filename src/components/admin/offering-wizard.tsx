"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/common/form-field";
import { NativeSelect } from "@/components/common/native-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { ApiError } from "@/lib/api-error";
import { applyApiError } from "@/lib/form-errors";
import { cn } from "@/lib/utils";
import { offeringSchema, type OfferingInput } from "@/lib/validators/admin";
import type { AdminUser, Course } from "@/types/api";

type Field = keyof OfferingInput;

const STEPS: { title: string; description: string; fields: Field[] }[] = [
  { title: "Course", description: "Which course is being offered?", fields: ["courseId"] },
  { title: "Teacher and term", description: "Who teaches it, and when?", fields: ["teacherId", "semester", "section"] },
  { title: "Capacity and review", description: "Set the seat limit and confirm.", fields: ["capacity"] },
];

export function OfferingWizard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);

  const courses = useQuery({
    queryKey: ["course-options"],
    queryFn: ({ signal }) => api.list<Course>("courses", { limit: 100, sortBy: "code", order: "asc" }, signal),
    select: (result) => result.data,
  });
  const teachers = useQuery({
    queryKey: ["teacher-options"],
    queryFn: ({ signal }) => api.list<AdminUser>("admin/users", { role: "TEACHER", status: "ACTIVE", limit: 100, sortBy: "name", order: "asc" }, signal),
    select: (result) => result.data,
  });

  const { register, handleSubmit, trigger, getValues, watch, setError, formState } = useForm<OfferingInput>({
    resolver: zodResolver(offeringSchema),
    defaultValues: { courseId: "", teacherId: "", semester: "", section: "A", capacity: "40" },
  });
  const { errors } = formState;
  const values = watch();
  const course = courses.data?.find((item) => item.id === values.courseId);
  const teacher = teachers.data?.find((item) => item.id === values.teacherId);

  const create = useMutation({
    mutationFn: (input: OfferingInput) =>
      api.post("offerings", {
        courseId: input.courseId,
        teacherId: input.teacherId,
        semester: input.semester,
        section: input.section,
        capacity: Number(input.capacity),
      }),
    onSuccess: async () => {
      toast.success("Offering created");
      await queryClient.invalidateQueries({ queryKey: ["offerings"] });
      router.push("/admin/academics");
    },
    onError: (error) => {
      applyApiError(error, setError, ["courseId", "teacherId", "semester", "section", "capacity"]);
      // A server error can belong to an earlier step, so take the user back to it.
      if (error instanceof ApiError) {
        const failed = error.errors.map((issue) => issue.field.split(".").pop());
        const index = STEPS.findIndex((item) => item.fields.some((field) => failed.includes(field)));
        if (index >= 0) setStep(index);
      }
    },
  });

  // Validate only the fields on the current step before moving on.
  const next = async () => {
    const valid = await trigger(STEPS[step]!.fields);
    if (valid) setStep((current) => current + 1);
  };
  const last = step === STEPS.length - 1;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <ol className="mb-3 flex items-center gap-2" aria-label="Progress">
          {STEPS.map((item, index) => (
            <li key={item.title} className="flex flex-1 items-center gap-2" aria-current={index === step ? "step" : undefined}>
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
                  index < step ? "bg-primary text-primary-foreground" : index === step ? "bg-primary/15 text-primary ring-2 ring-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {index < step ? <Check className="size-3.5" aria-hidden /> : index + 1}
              </span>
              <span className={cn("hidden text-xs font-medium sm:block", index === step ? "text-foreground" : "text-muted-foreground")}>{item.title}</span>
              {index < STEPS.length - 1 ? <span className="h-px flex-1 bg-border" aria-hidden /> : null}
            </li>
          ))}
        </ol>
        <CardTitle>{STEPS[step]!.title}</CardTitle>
        <CardDescription>{STEPS[step]!.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((input) => create.mutate(input))}
          noValidate
          className="space-y-4"
          onKeyDown={(event) => {
            // Enter on an earlier step moves forward instead of submitting the whole form.
            if (event.key === "Enter" && !last && (event.target as HTMLElement).tagName !== "BUTTON") {
              event.preventDefault();
              void next();
            }
          }}
        >
          <div className={cn("space-y-4", step !== 0 && "hidden")}>
            <FormField id="offering-course" label="Course" error={errors.courseId?.message}>
              <NativeSelect id="offering-course" aria-invalid={!!errors.courseId} disabled={courses.isLoading} {...register("courseId")}>
                <option value="">{courses.isLoading ? "Loading courses..." : "Select a course"}</option>
                {courses.data?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} · {item.title} ({item.credit} cr)
                  </option>
                ))}
              </NativeSelect>
            </FormField>
          </div>

          <div className={cn("space-y-4", step !== 1 && "hidden")}>
            <FormField id="offering-teacher" label="Teacher" error={errors.teacherId?.message}>
              <NativeSelect id="offering-teacher" aria-invalid={!!errors.teacherId} disabled={teachers.isLoading} {...register("teacherId")}>
                <option value="">{teachers.isLoading ? "Loading teachers..." : "Select a teacher"}</option>
                {teachers.data?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="offering-semester" label="Semester" error={errors.semester?.message} hint="e.g. Fall 2026">
                <Input id="offering-semester" className="h-9" placeholder="Fall 2026" aria-invalid={!!errors.semester} {...register("semester")} />
              </FormField>
              <FormField id="offering-section" label="Section" error={errors.section?.message}>
                <Input id="offering-section" className="h-9" aria-invalid={!!errors.section} {...register("section")} />
              </FormField>
            </div>
          </div>

          <div className={cn("space-y-4", step !== 2 && "hidden")}>
            <FormField id="offering-capacity" label="Capacity" error={errors.capacity?.message} hint="Maximum number of students (1-500)">
              <Input id="offering-capacity" inputMode="numeric" className="h-9 sm:w-40" aria-invalid={!!errors.capacity} {...register("capacity")} />
            </FormField>
            <dl className="grid gap-3 rounded-lg bg-muted/60 p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Course</dt>
                <dd className="font-medium">{course ? `${course.code} · ${course.title}` : "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Teacher</dt>
                <dd className="font-medium">{teacher?.name ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Semester</dt>
                <dd className="font-medium">{values.semester ? `${values.semester} · Section ${values.section}` : "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Capacity</dt>
                <dd className="font-medium">{getValues("capacity") || "-"} seats</dd>
              </div>
            </dl>
          </div>

          <div className="flex justify-between gap-2 pt-2">
            <Button type="button" variant="outline" disabled={step === 0 || create.isPending} onClick={() => setStep((current) => current - 1)}>
              <ArrowLeft aria-hidden />
              Back
            </Button>
            {/* Separate keys give each button its own DOM node, so the Next click can never turn into a submit. */}
            {last ? (
              <Button key="create" type="submit" disabled={create.isPending}>
                {create.isPending ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />}
                Create offering
              </Button>
            ) : (
              <Button key="next" type="button" onClick={() => void next()}>
                Next
                <ArrowRight aria-hidden />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
