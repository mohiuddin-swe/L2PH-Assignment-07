import { ApiError } from "@/lib/api-error";
import { buildQuery, type QueryValue } from "@/lib/query-string";
import type { ApiEnvelope, Paginated } from "@/types/api";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
}

// Browser -> Next.js proxy (/api/proxy/*) -> backend. Tokens live in httpOnly cookies,
// so no token ever touches client-side JavaScript.
async function request<T>(path: string, options: RequestOptions = {}): Promise<{ data: T; meta?: Paginated<T>["meta"]; message: string }> {
  const { method = "GET", body, query, signal } = options;
  let res: Response;
  try {
    res = await fetch(`/api/proxy/${path.replace(/^\//, "")}${buildQuery(query)}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Network error. Please check your connection and try again.", 0);
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (res.status === 401 && typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
  }

  if (!res.ok || !json || !json.success) {
    const failure = json && !json.success ? json : null;
    throw new ApiError(failure?.message ?? `Request failed (${res.status})`, res.status, failure?.errors ?? []);
  }
  return { data: json.data, meta: json.meta, message: json.message };
}

export const api = {
  get: <T>(path: string, query?: Record<string, QueryValue>, signal?: AbortSignal) =>
    request<T>(path, { query, signal }).then((r) => r.data),

  list: <T>(path: string, query?: Record<string, QueryValue>, signal?: AbortSignal) =>
    request<T[]>(path, { query, signal }).then((r) => ({ data: r.data, meta: r.meta! }) as Paginated<T>),

  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: body ?? {} }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body: body ?? {} }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body: body ?? {} }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};