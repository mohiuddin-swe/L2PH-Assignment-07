import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";
import { refreshSession } from "@/lib/refresh";
import { ACCESS_COOKIE, REFRESH_COOKIE, decodeJwt, isExpired, setAuthCookies } from "@/lib/session";
import type { TokenPair } from "@/types/api";

export const maxDuration = 60;

type Context = { params: Promise<{ path: string[] }> };

// Browser code calls /api/proxy/<backend path>. We add the access token from the httpOnly cookie,
// refresh it when needed, and pass the backend response through untouched.
async function handle(request: NextRequest, context: Context) {
  const { path } = await context.params;

  // Auth endpoints have their own routes (they must never expose tokens to the browser).
  if (path[0] === "auth") {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  const target = `${BACKEND_URL}/${path.join("/")}${request.nextUrl.search}`;
  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.text() : undefined;

  let access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  let rotated: TokenPair | null = null;

  if (refresh && isExpired(access ? decodeJwt(access) : null)) {
    rotated = await refreshSession(refresh);
    if (rotated) access = rotated.accessToken;
  }

  const send = (token?: string) =>
    fetch(target, {
      method: request.method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(58_000),
    });

  let upstream: Response;
  try {
    upstream = await send(access);
    if (upstream.status === 401 && refresh && !rotated) {
      rotated = await refreshSession(refresh);
      if (rotated) upstream = await send(rotated.accessToken);
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "The server is not reachable right now. Please try again." },
      { status: 503 },
    );
  }

  const out = new NextResponse(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });
  if (rotated) setAuthCookies(out.cookies, rotated);
  return out;
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;