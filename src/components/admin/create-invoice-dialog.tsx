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
import { api } from "@/lib/api-client";
import { applyApiError } from "@/lib/form-errors";
import { createInvoiceSchema, type CreateInvoiceInput } from "@/lib/validators/admin";
import type { AdminUser } from "@/types/api";

export function CreateInvoiceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create an invoice</DialogTitle>
          <DialogDescription>Students must pay the invoice for a semester before they can enroll in its courses.</DialogDescription>
        </DialogHeader>
        <CreateInvoiceForm onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CreateInvoiceForm({ onDone }: { onDone: () => void }) {
  const queryClient = useQueryClient();
  const students = useQuery({
    queryKey: ["student-options"],
    queryFn: ({ signal }) => api.list<AdminUser>("admin/users", { role: "STUDENT", status: "ACTIVE", limit: 100, sortBy: "name", order: "asc" }, signal),
    select: (result) => result.data,
  });
  const { register, handleSubmit, setError, formState } = useForm<CreateInvoiceInput>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: { studentId: "", title: "", semester: "", amount: "", dueDate: "" },
  });
  const { errors } = formState;

  const mutation = useMutation({
    mutationFn: (values: CreateInvoiceInput) =>
      api.post("invoices", {
        studentId: values.studentId,
        title: values.title,
        amount: Number(values.amount),
        semester: values.semester ? values.semester : undefined,
        dueDate: values.dueDate ? values.dueDate : undefined,
      }),
    onSuccess: async () => {
      toast.success("Invoice created");
      await queryClient.invalidateQueries({ queryKey: ["admin-invoices"] });
      onDone();
    },
    onError: (error) => applyApiError(error, setError, ["studentId", "title", "semester", "amount", "dueDate"]),
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-4">
      <FormField id="invoice-student" label="Student" error={errors.studentId?.message}>
        <NativeSelect id="invoice-student" aria-invalid={!!errors.studentId} disabled={students.isLoading} {...register("studentId")}>
          <option value="">{students.isLoading ? "Loading students..." : "Select a student"}</option>
          {students.data?.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.studentProfile?.studentId ?? student.email})
            </option>
          ))}
        </NativeSelect>
      </FormField>
      <FormField id="invoice-title" label="Title" error={errors.title?.message}>
        <Input id="invoice-title" className="h-9" placeholder="Fall 2026 Tuition Fee" aria-invalid={!!errors.title} {...register("title")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="invoice-semester" label="Semester" optional error={errors.semester?.message} hint="Must match the offering semester, e.g. Fall 2026">
          <Input id="invoice-semester" className="h-9" placeholder="Fall 2026" aria-invalid={!!errors.semester} {...register("semester")} />
        </FormField>
        <FormField id="invoice-amount" label="Amount (BDT)" error={errors.amount?.message}>
          <Input id="invoice-amount" inputMode="decimal" className="h-9" placeholder="45000" aria-invalid={!!errors.amount} {...register("amount")} />
        </FormField>
      </div>
      <FormField id="invoice-due" label="Due date" optional error={errors.dueDate?.message}>
        <Input id="invoice-due" type="date" className="h-9 sm:w-48" {...register("dueDate")} />
      </FormField>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={mutation.isPending} onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" aria-hidden /> : null}
          Create invoice
        </Button>
      </div>
    </form>
  );
}
