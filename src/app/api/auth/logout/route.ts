import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";
import { clearAuthCookies, REFRESH_COOKIE } from "@/lib/session";

export async function POST() {
  const refreshToken = (await cookies()).get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    // Best effort: revoke the session on the backend, but always clear our cookies.
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    }).catch(() => undefined);
  }

  const response = NextResponse.json({ success: true, message: "Logged out" });
  clearAuthCookies(response.cookies);
  return response;
}