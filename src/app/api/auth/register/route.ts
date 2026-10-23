import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";
import { setAuthCookies } from "@/lib/session";
import type { ApiEnvelope, AuthResult } from "@/types/api";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
      cache: "no-store",
      signal: AbortSignal.timeout(58_000),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "The server is waking up. Please try again in a few seconds." },
      { status: 503 },
    );
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<AuthResult> | null;
  if (!res.ok || !json || !json.success) {
    return NextResponse.json(json ?? { success: false, message: "Registration failed" }, { status: res.status || 500 });
  }

  const response = NextResponse.json(
    { success: true, message: json.message, data: { user: json.data.user } },
    { status: 201 },
  );
  setAuthCookies(response.cookies, json.data);
  return response;
}