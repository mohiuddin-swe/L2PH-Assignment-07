"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { applyApiError } from "@/lib/form-errors";
import { profileSchema, type ProfileInput } from "@/lib/validators/profile";
import type { Profile } from "@/types/api";

export function ProfileEditForm({ user }: { user: Profile }) {
  const router = useRouter();
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, phone: user.phone ?? "" },
  });
  const { register, handleSubmit, setError, reset, formState } = form;
  const { errors, isDirty } = formState;

  const mutation = useMutation({
    mutationFn: async (values: ProfileInput) =>
      (await api.patch<Profile>("users/me", { name: values.name, phone: values.phone ? values.phone : null })).data,
    onSuccess: (updated) => {
      toast.success("Profile updated");
      reset({ name: updated.name, phone: updated.phone ?? "" });
      // Re-runs the server layout so the sidebar and user menu show the new name.
      router.refresh();
    },
    onError: (error) => applyApiError(error, setError, ["name", "phone"]),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit profile</CardTitle>
        <CardDescription>You can change your name and phone number. Email and role are managed by the university.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="profile-name" label="Full name" error={errors.name?.message}>
              <Input id="profile-name" autoComplete="name" className="h-9" aria-invalid={!!errors.name} {...register("name")} />
            </FormField>
            <FormField id="profile-phone" label="Phone" optional error={errors.phone?.message} hint="e.g. 01712345678">
              <Input id="profile-phone" type="tel" inputMode="numeric" autoComplete="tel" className="h-9" aria-invalid={!!errors.phone} {...register("phone")} />
            </FormField>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={!isDirty || mutation.isPending}>
              {mutation.isPending ? <Loader2 className="animate-spin" aria-hidden /> : null}
              {mutation.isPending ? "Saving..." : "Save changes"}
            </Button>
            <Button type="button" variant="outline" disabled={!isDirty || mutation.isPending} onClick={() => reset()}>
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}