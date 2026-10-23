import type { Role, TokenPair } from "@/types/api";

export const ACCESS_COOKIE = "ums_access";
export const REFRESH_COOKIE = "ums_refresh";

const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // matches the backend (7 days)

export interface JwtPayload {
  sub: string;
  role: Role;
  iat: number;
  exp: number;
}

// Decode only (no signature check): real verification always happens in the backend.
// We use this just to know the role and the expiry for routing and refresh decisions.
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
    const payload = JSON.parse(atob(base64)) as Partial<JwtPayload>;
    if (typeof payload.exp !== "number" || typeof payload.sub !== "string" || !payload.role) return null;
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export function isExpired(payload: JwtPayload | null, skewSeconds = 30): boolean {
  return !payload || payload.exp * 1000 < Date.now() + skewSeconds * 1000;
}

interface CookieWriter {
  set(name: string, value: string, options?: Record<string, unknown>): unknown;
}

const baseOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
});

export function setAuthCookies(cookies: CookieWriter, tokens: TokenPair) {
  const payload = decodeJwt(tokens.accessToken);
  const accessMaxAge = payload ? Math.max(payload.exp - Math.floor(Date.now() / 1000), 60) : 15 * 60;
  cookies.set(ACCESS_COOKIE, tokens.accessToken, { ...baseOptions(), maxAge: accessMaxAge });
  cookies.set(REFRESH_COOKIE, tokens.refreshToken, { ...baseOptions(), maxAge: REFRESH_MAX_AGE });
}

export function clearAuthCookies(cookies: CookieWriter) {
  cookies.set(ACCESS_COOKIE, "", { ...baseOptions(), maxAge: 0 });
  cookies.set(REFRESH_COOKIE, "", { ...baseOptions(), maxAge: 0 });
}