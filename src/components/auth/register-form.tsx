"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/common/form-field";
import { PasswordInput } from "@/components/common/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register as registerUser } from "@/lib/auth-client";
import { ROLE_HOME } from "@/lib/constants";
import { applyApiError } from "@/lib/form-errors";
import { firstName } from "@/lib/format";
import { registerSchema, type RegisterInput } from "@/lib/validators/auth";

export function RegisterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  });
  const { register, handleSubmit, setError, formState } = form;
  const { errors } = formState;

  const mutation = useMutation({
    mutationFn: (values: RegisterInput) =>
      registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone ? values.phone : undefined,
      }),
    onSuccess: (user) => {
      toast.success(`Account created. Welcome, ${firstName(user.name)}!`);
      queryClient.clear();
      router.replace(ROLE_HOME[user.role]);
      router.refresh();
    },
    onError: (error) => applyApiError(error, setError, ["name", "email", "phone", "password"]),
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-4">
      <FormField id="name" label="Full name" error={errors.name?.message}>
        <Input id="name" autoComplete="name" placeholder="Ayesha Siddika" className="h-9" aria-invalid={!!errors.name} {...register("name")} />
      </FormField>
      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="you@university.edu" className="h-9" aria-invalid={!!errors.email} {...register("email")} />
      </FormField>
      <FormField id="phone" label="Phone" optional error={errors.phone?.message} hint="Bangladeshi mobile number, e.g. 01712345678">
        <Input id="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="01712345678" className="h-9" aria-invalid={!!errors.phone} {...register("phone")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="password" label="Password" error={errors.password?.message} hint="8+ characters with a letter and a number">
          <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!errors.password} {...register("password")} />
        </FormField>
        <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
          <PasswordInput id="confirmPassword" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
        </FormField>
      </div>
      <Button type="submit" size="lg" className="h-9 w-full" disabled={mutation.isPending}>
        {mutation.isPending ? <Loader2 className="animate-spin" aria-hidden /> : null}
        Create account
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}