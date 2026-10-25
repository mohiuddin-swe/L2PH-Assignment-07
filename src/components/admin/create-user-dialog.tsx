"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/common/form-field";
import { NativeSelect } from "@/components/common/native-select";
import { PasswordInput } from "@/components/common/password-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { applyApiError } from "@/lib/form-errors";
import { createUserSchema, type CreateUserInput } from "@/lib/validators/admin";

export function CreateUserDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a user</DialogTitle>
          <DialogDescription>Create a student, teacher or admin account. They can sign in right away.</DialogDescription>
        </DialogHeader>
        <CreateUserForm onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CreateUserForm({ onDone }: { onDone: () => void }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setError, formState } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "", password: "", role: "STUDENT", phone: "" },
  });
  const { errors } = formState;

  const mutation = useMutation({
    mutationFn: (values: CreateUserInput) => api.post("admin/users", { ...values, phone: values.phone ? values.phone : undefined }),
    onSuccess: async () => {
      toast.success("User created");
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onDone();
    },
    onError: (error) => applyApiError(error, setError, ["name", "email", "password", "role", "phone"]),
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="user-name" label="Full name" error={errors.name?.message}>
          <Input id="user-name" className="h-9" aria-invalid={!!errors.name} {...register("name")} />
        </FormField>
        <FormField id="user-role" label="Role" error={errors.role?.message}>
          <NativeSelect id="user-role" {...register("role")}>
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
            <option value="ADMIN">Admin</option>
          </NativeSelect>
        </FormField>
      </div>
      <FormField id="user-email" label="Email" error={errors.email?.message}>
        <Input id="user-email" type="email" className="h-9" aria-invalid={!!errors.email} {...register("email")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="user-password" label="Password" error={errors.password?.message} hint="8+ characters, a letter and a number">
          <PasswordInput id="user-password" autoComplete="new-password" aria-invalid={!!errors.password} {...register("password")} />
        </FormField>
        <FormField id="user-phone" label="Phone" optional error={errors.phone?.message}>
          <Input id="user-phone" type="tel" className="h-9" aria-invalid={!!errors.phone} {...register("phone")} />
        </FormField>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={mutation.isPending} onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" aria-hidden /> : null}
          Create user
        </Button>
      </div>
    </form>
  );
}
