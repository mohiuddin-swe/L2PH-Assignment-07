"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, GraduationCap, Loader2, Presentation, ShieldCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/common/form-field";
import { PasswordInput } from "@/components/common/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth-client";
import { DEMO_ACCOUNTS, ROLE_HOME, ROLE_LABEL } from "@/lib/constants";
import { applyApiError } from "@/lib/form-errors";
import { firstName } from "@/lib/format";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";
import type { Role } from "@/types/api";

const DEMO_ICONS: Record<Role, LucideIcon> = {
  ADMIN: ShieldCheck,
  TEACHER: Presentation,
  STUDENT: GraduationCap,
};

// Only allow in-app paths so ?next= cannot be used as an open redirect.
function safeNext(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const next = safeNext(useSearchParams().get("next"));
  const [demoRole, setDemoRole] = useState<Role | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { register, handleSubmit, setError, formState } = form;
  const { errors } = formState;

  const mutation = useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (user) => {
      toast.success(`Welcome back, ${firstName(user.name)}`);
      queryClient.clear();
      router.replace(next ?? ROLE_HOME[user.role]);
      router.refresh();
    },
    onError: (error) => applyApiError(error, setError, ["email", "password"]),
  });

  const onSubmit = handleSubmit((values) => {
    setDemoRole(null);
    mutation.mutate(values);
  });

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@university.edu"
            className="h-9"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>
        <FormField id="password" label="Password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
        </FormField>
        <Button type="submit" size="lg" className="h-9 w-full" disabled={mutation.isPending}>
          {mutation.isPending && demoRole === null ? <Loader2 className="animate-spin" aria-hidden /> : null}
          Sign in
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <p className="relative mx-auto w-fit bg-background px-3 text-xs text-muted-foreground uppercase">
          Or try a demo account
        </p>
      </div>

      <div className="grid gap-2">
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = DEMO_ICONS[account.role];
          const loading = mutation.isPending && demoRole === account.role;
          return (
            <Button
              key={account.role}
              type="button"
              variant="outline"
              className="h-auto justify-start gap-3 p-3 text-left"
              disabled={mutation.isPending}
              onClick={() => {
                setDemoRole(account.role);
                mutation.mutate({ email: account.email, password: account.password });
              }}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                {loading ? <Loader2 className="animate-spin" aria-hidden /> : <Icon aria-hidden />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">Continue as {ROLE_LABEL[account.role]}</span>
                <span className="block truncate text-xs font-normal text-muted-foreground">{account.blurb}</span>
              </span>
              <ArrowRight className="text-muted-foreground" aria-hidden />
            </Button>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        New student?{" "}
        <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}