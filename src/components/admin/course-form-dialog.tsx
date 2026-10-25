"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/common/form-field";
import { NativeSelect } from "@/components/common/native-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import { applyApiError } from "@/lib/form-errors";
import { courseSchema, type CourseInput } from "@/lib/validators/academics";
import type { Course, Department } from "@/types/api";

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass a course to edit it, or nothing to create a new one. */
  course?: Course | null;
}

export function CourseFormDialog({ open, onOpenChange, course }: CourseFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{course ? "Edit course" : "New course"}</DialogTitle>
          <DialogDescription>Courses can be opened for enrollment by creating an offering.</DialogDescription>
        </DialogHeader>
        <CourseForm course={course ?? null} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CourseForm({ course, onDone }: { course: Course | null; onDone: () => void }) {
  const queryClient = useQueryClient();
  const departments = useQuery({
    queryKey: ["department-options"],
    queryFn: ({ signal }) => api.list<Department>("departments", { limit: 100 }, signal),
    select: (result) => result.data,
  });
  const { register, handleSubmit, setError, formState } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      code: course?.code ?? "",
      title: course?.title ?? "",
      description: course?.description ?? "",
      credit: String(course?.credit ?? 3),
      departmentId: course?.departmentId ?? "",
    },
  });
  const { errors } = formState;

  const mutation = useMutation({
    mutationFn: (values: CourseInput) => {
      const body = { code: values.code, title: values.title, credit: Number(values.credit), departmentId: values.departmentId };
      if (course) return api.patch(`courses/${course.id}`, { ...body, description: values.description ? values.description : null });
      return api.post("courses", { ...body, description: values.description ? values.description : undefined });
    },
    onSuccess: async () => {
      toast.success(course ? "Course updated" : "Course created");
      await queryClient.invalidateQueries({ queryKey: ["courses"] });
      await queryClient.invalidateQueries({ queryKey: ["course-options"] });
      onDone();
    },
    onError: (error) => applyApiError(error, setError, ["code", "title", "description", "credit", "departmentId"]),
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="course-code" label="Code" error={errors.code?.message}>
          <Input id="course-code" className="h-9" placeholder="CSE305" aria-invalid={!!errors.code} {...register("code")} />
        </FormField>
        <FormField id="course-title" label="Title" error={errors.title?.message} className="sm:col-span-2">
          <Input id="course-title" className="h-9" placeholder="Operating Systems" aria-invalid={!!errors.title} {...register("title")} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="course-department" label="Department" error={errors.departmentId?.message}>
          <NativeSelect id="course-department" aria-invalid={!!errors.departmentId} disabled={departments.isLoading} {...register("departmentId")}>
            <option value="">{departments.isLoading ? "Loading..." : "Select a department"}</option>
            {departments.data?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.code})
              </option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField id="course-credit" label="Credit" error={errors.credit?.message}>
          <NativeSelect id="course-credit" aria-invalid={!!errors.credit} {...register("credit")}>
            {[1, 2, 3, 4, 5, 6].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </NativeSelect>
        </FormField>
      </div>
      <FormField id="course-description" label="Description" optional error={errors.description?.message}>
        <Textarea id="course-description" rows={3} aria-invalid={!!errors.description} {...register("description")} />
      </FormField>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={mutation.isPending} onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {course ? "Save changes" : "Create course"}
        </Button>
      </div>
    </form>
  );
}
