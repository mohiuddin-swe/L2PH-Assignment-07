"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { QueryValue } from "@/lib/query-string";

type Order = "asc" | "desc";
type Updates = Record<string, string | number | null | undefined>;

interface Options {
  /** Extra URL params that act as filters, e.g. ["status", "semester"]. */
  filterKeys?: readonly string[];
  defaultLimit?: number;
  defaultSortBy?: string;
  defaultOrder?: Order;
}

// Keeps page, search, sort and filters in the URL (?page=2&q=ayesha&status=PAID), so a filtered
// list survives a refresh, can be shared as a link, and works with the back button.
export function useListParams({ filterKeys = [], defaultLimit = 10, defaultSortBy, defaultOrder = "desc" }: Options = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Number(searchParams.get("limit")) || defaultLimit;
  const q = searchParams.get("q") ?? "";
  const sortBy = searchParams.get("sortBy") ?? defaultSortBy ?? "";
  const orderParam = searchParams.get("order");
  const order: Order = orderParam === "asc" || orderParam === "desc" ? orderParam : defaultOrder;

  const filters: Record<string, string> = {};
  for (const key of filterKeys) filters[key] = searchParams.get(key) ?? "";

  // Ready to pass straight to the API (empty values are dropped by buildQuery).
  const query: Record<string, QueryValue> = {
    page,
    limit,
    q: q || undefined,
    sortBy: sortBy || undefined,
    order: sortBy ? order : undefined,
    ...filters,
  };

  const update = useCallback(
    (updates: Updates) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      // Any change to the search, sort or filters goes back to page 1.
      if (!("page" in updates)) next.delete("page");
      const text = next.toString();
      startTransition(() => router.replace(text ? `${pathname}?${text}` : pathname, { scroll: false }));
    },
    [pathname, router, searchParams],
  );

  const hasActiveFilters = q !== "" || Object.values(filters).some(Boolean);

  return {
    page,
    limit,
    q,
    sortBy,
    order,
    filters,
    query,
    isPending,
    hasActiveFilters,
    setSearch: (value: string) => update({ q: value }),
    setFilter: (key: string, value: string) => update({ [key]: value }),
    setPage: (value: number) => update({ page: value }),
    setLimit: (value: number) => update({ limit: value }),
    setSort: (key: string) => update({ sortBy: key, order: sortBy === key && order === "asc" ? "desc" : "asc" }),
    reset: () => startTransition(() => router.replace(pathname, { scroll: false })),
  };
}