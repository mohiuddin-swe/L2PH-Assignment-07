"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { ApiError } from "@/lib/api-error";
import type { MyEnrollment } from "@/types/api";

function refreshEnrollmentData(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["my-enrollments"] }),
    queryClient.invalidateQueries({ queryKey: ["enrolled-offerings"] }),
    queryClient.invalidateQueries({ queryKey: ["offerings"] }),
  ]);
}

export function useEnroll() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (offeringId: string) => (await api.post<MyEnrollment>("enrollments", { offeringId })).data,
    onSuccess: async () => {
      toast.success("You are enrolled in this course");
      await refreshEnrollmentData(queryClient);
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 402) {
        // The backend blocks enrollment until the semester invoice is paid.
        toast.error(error.message, {
          description: "Pay the invoice for this semester, then try again.",
          action: { label: "Open invoices", onClick: () => router.push("/student/invoices") },
        });
        return;
      }
      toast.error(error instanceof Error ? error.message : "Could not enroll");
    },
  });
}

export function useDropEnrollment() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (enrollmentId: string) => (await api.post<MyEnrollment>(`enrollments/${enrollmentId}/drop`)).data,
    onSuccess: async () => {
      toast.success("Course dropped");
      await refreshEnrollmentData(queryClient);
      router.refresh();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not drop the course"),
  });
}