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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import { applyApiError } from "@/lib/form-errors";
import { noticeSchema, type NoticeInput } from "@/lib/validators/notice";
import type { Notice } from "@/types/api";

interface NoticeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass a notice to edit it, or nothing to create a new one. */
  notice?: Notice | null;
}

export function NoticeFormDialog({ open, onOpenChange, notice }: NoticeFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{notice ? "Edit notice" : "New notice"}</DialogTitle>
          <DialogDescription>Notices are visible to every student, teacher and admin.</DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so the form starts fresh every time. */}
        <NoticeForm notice={notice ?? null} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function NoticeForm({ notice, onDone }: { notice: Notice | null; onDone: () => void }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setError, formState } = useForm<NoticeInput>({
    resolver: zodResolver(noticeSchema),
    defaultValues: { title: notice?.title ?? "", content: notice?.content ?? "" },
  });
  const { errors } = formState;

  const mutation = useMutation({
    mutationFn: (values: NoticeInput) => (notice ? api.patch(`notices/${notice.id}`, values) : api.post("notices", values)),
    onSuccess: async () => {
      toast.success(notice ? "Notice updated" : "Notice published");
      await queryClient.invalidateQueries({ queryKey: ["notices"] });
      onDone();
    },
    onError: (error) => applyApiError(error, setError, ["title", "content"]),
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-4">
      <FormField id="notice-title" label="Title" error={errors.title?.message}>
        <Input id="notice-title" className="h-9" placeholder="Midterm schedule announced" aria-invalid={!!errors.title} {...register("title")} />
      </FormField>
      <FormField id="notice-content" label="Message" error={errors.content?.message}>
        <Textarea id="notice-content" rows={5} placeholder="Write the announcement..." aria-invalid={!!errors.content} {...register("content")} />
      </FormField>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={mutation.isPending} onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {notice ? "Save changes" : "Publish notice"}
        </Button>
      </div>
    </form>
  );
}