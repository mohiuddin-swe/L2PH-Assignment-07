import { NextResponse, type NextRequest } from "next/server";
import { clearAuthCookies } from "@/lib/session";

// Server Components send users here when the backend rejects their session (for example the
// account was suspended). It clears the stale cookies, which also prevents a /login <-> dashboard loop.
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  clearAuthCookies(response.cookies);
  return response;
}