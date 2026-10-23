"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryValue } from "@/lib/query-string";

// One paginated list from the API. The previous page stays on screen while the next one loads,
// so the table does not flash empty on every page or filter change.
export function useListQuery<T>(key: string, path: string, query: Record<string, QueryValue>) {
  return useQuery({
    queryKey: [key, query],
    queryFn: ({ signal }) => api.list<T>(path, query, signal),
    placeholderData: keepPreviousData,
  });
}