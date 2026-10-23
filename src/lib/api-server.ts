import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api-error";
import { BACKEND_URL } from "@/lib/config";
import { buildQuery, type QueryValue } from "@/lib/query-string";
import { ACCESS_COOKIE } from "@/lib/session";
import type { ApiEnvelope, Paginated } from "@/types/api";

async function serverRequest<T>(path: string, query?: Record<string, QueryValue>) {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) redirect("/login");

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/${path.replace(/^\//, "")}${buildQuery(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    throw new ApiError("The server is not reachable right now. Please try again in a moment.", 503);
  }

  if (res.status === 401) redirect("/login");

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok || !json || !json.success) {
    const failure = json && !json.success ? json : null;
    throw new ApiError(failure?.message ?? `Request failed (${res.status})`, res.status, failure?.errors ?? []);
  }
  return json;
}

// For Server Components: fetches on the server with the session cookie.
export async function apiGet<T>(path: string, query?: Record<string, QueryValue>): Promise<T> {
  return (await serverRequest<T>(path, query)).data;
}

export async function apiGetList<T>(path: string, query?: Record<string, QueryValue>): Promise<Paginated<T>> {
  const json = await serverRequest<T[]>(path, query);
  return { data: json.data, meta: json.meta! };
}