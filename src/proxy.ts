import { NextRequest, NextResponse } from "next/server";
import { ROLE_HOME, ROLE_PREFIX } from "@/lib/constants";
import { refreshSession } from "@/lib/refresh";
import { ACCESS_COOKIE, REFRESH_COOKIE, clearAuthCookies, decodeJwt, isExpired, setAuthCookies } from "@/lib/session";
import type { TokenPair } from "@/types/api";

const AUTH_PAGES = ["/login", "/register"];

// Route protection (Next.js 16 "proxy", formerly middleware):
//  1. keeps the session fresh (refreshes the access token before pages render)
//  2. sends visitors without a session to /login
//  3. keeps each role inside its own area (/admin, /teacher, /student)
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  let payload = access ? decodeJwt(access) : null;
  let rotated: TokenPair | null = null;

  if (isExpired(payload) && refresh) {
    rotated = await refreshSession(refresh);
    payload = rotated ? decodeJwt(rotated.accessToken) : null;
  }

  const area = Object.keys(ROLE_PREFIX).find((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  const redirectTo = (url: string) => {
    const response = NextResponse.redirect(new URL(url, request.url));
    if (!payload) clearAuthCookies(response.cookies);
    else if (rotated) setAuthCookies(response.cookies, rotated);
    return response;
  };

  if (area) {
    if (!payload) return redirectTo(`/login?next=${encodeURIComponent(pathname)}`);
    if (payload.role !== ROLE_PREFIX[area]) return redirectTo(ROLE_HOME[payload.role]);
  }

  if (AUTH_PAGES.includes(pathname) && payload) {
    return redirectTo(ROLE_HOME[payload.role]);
  }

  // Let the page render, but hand it the refreshed cookies so Server Components see them.
  if (rotated) {
    request.cookies.set(ACCESS_COOKIE, rotated.accessToken);
    request.cookies.set(REFRESH_COOKIE, rotated.refreshToken);
  }
  const response = NextResponse.next({ request });
  if (rotated) setAuthCookies(response.cookies, rotated);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};