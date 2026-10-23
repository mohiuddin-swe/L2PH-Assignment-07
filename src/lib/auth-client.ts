import { ApiError } from "@/lib/api-error";
import type { LoginInput, RegisterInput } from "@/lib/validators/auth";
import type { ApiEnvelope, AuthUser } from "@/types/api";

// Calls the Next.js route handlers in /api/auth. They talk to the backend and keep the tokens
// in httpOnly cookies, so the browser only ever receives the user object.
async function authRequest(path: "login" | "register" | "logout", body?: unknown): Promise<AuthUser | null> {
  let res: Response;
  try {
    res = await fetch(`/api/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Network error. Please check your connection and try again.", 0);
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<{ user: AuthUser }> | null;
  if (!res.ok || !json || !json.success) {
    const failure = json && !json.success ? json : null;
    throw new ApiError(failure?.message ?? `Request failed (${res.status})`, res.status, failure?.errors ?? []);
  }
  return "user" in (json.data ?? {}) ? json.data.user : null;
}

export async function login(input: LoginInput): Promise<AuthUser> {
  const user = await authRequest("login", input);
  if (!user) throw new ApiError("Login failed", 500);
  return user;
}

export async function register(input: Omit<RegisterInput, "confirmPassword">): Promise<AuthUser> {
  const user = await authRequest("register", input);
  if (!user) throw new ApiError("Registration failed", 500);
  return user;
}

export async function logout(): Promise<void> {
  await authRequest("logout");
}