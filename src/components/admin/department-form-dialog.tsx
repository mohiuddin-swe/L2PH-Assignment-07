"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { applyApiError } from "@/lib/form-errors";
import { departmentSchema, type DepartmentInput } from "@/lib/validators/academics";
import type { Department } from "@/types/api";

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass a department to edit it, or nothing to create a new one. */
  department?: Department | null;
}

export function DepartmentFormDialog({ open, onOpenChange, department }: DepartmentFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{department ? "Edit department" : "New department"}</DialogTitle>
          <DialogDescription>Departments group courses and the people who teach and study them.</DialogDescription>
        </DialogHeader>
        <DepartmentForm department={department ?? null} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function DepartmentForm({ department, onDone }: { department: Department | null; onDone: () => void }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setError, formState } = useForm<DepartmentInput>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: department?.name ?? "", code: department?.code ?? "" },
  });
  const { errors } = formState;

  const mutation = useMutation({
    mutationFn: (values: DepartmentInput) => (department ? api.patch(`departments/${department.id}`, values) : api.post("departments", values)),
    onSuccess: async () => {
      toast.success(department ? "Department updated" : "Department created");
      await queryClient.invalidateQueries({ queryKey: ["departments"] });
      await queryClient.invalidateQueries({ queryKey: ["department-options"] });
      onDone();
    },
    onError: (error) => applyApiError(error, setError, ["name", "code"]),
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-4">
      <FormField id="department-name" label="Name" error={errors.name?.message}>
        <Input id="department-name" className="h-9" placeholder="Computer Science and Engineering" aria-invalid={!!errors.name} {...register("name")} />
      </FormField>
      <FormField id="department-code" label="Code" error={errors.code?.message} hint="2-10 letters or digits, e.g. CSE">
        <Input id="department-code" className="h-9 sm:w-40" placeholder="CSE" aria-invalid={!!errors.code} {...register("code")} />
      </FormField>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={mutation.isPending} onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {department ? "Save changes" : "Create department"}
        </Button>
      </div>
    </form>
  );
}
