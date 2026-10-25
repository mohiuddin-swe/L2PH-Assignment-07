"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ClassListItem } from "@/types/api";

// Students currently enrolled in one offering (the class list a teacher works with).
export function useRoster(offeringId: string) {
  return useQuery({
    queryKey: ["roster", offeringId],
    queryFn: ({ signal }) => api.list<ClassListItem>(`offerings/${offeringId}/enrollments`, { status: "ENROLLED", limit: 100 }, signal),
    select: (result) => result.data,
  });
}