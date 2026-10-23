import { BACKEND_URL } from "@/lib/config";
import type { ApiEnvelope, TokenPair } from "@/types/api";

// The backend rotates refresh tokens and treats a reused one as theft (it revokes the session).
// So parallel requests must share ONE refresh call. This map gives us that "single flight".
const inflight = new Map<string, Promise<TokenPair | null>>();

async function callRefresh(refreshToken: string): Promise<TokenPair | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<TokenPair>;
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export function refreshSession(refreshToken: string): Promise<TokenPair | null> {
  const existing = inflight.get(refreshToken);
  if (existing) return existing;
  const promise = callRefresh(refreshToken).finally(() => {
    setTimeout(() => inflight.delete(refreshToken), 5_000);
  });
  inflight.set(refreshToken, promise);
  return promise;
}