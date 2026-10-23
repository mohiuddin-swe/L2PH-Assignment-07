"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { Profile } from "@/types/api";

// The dashboard layout loads the user on the server; this puts it in the Zustand store
// so any client component (role-based buttons, menus) can read it without another request.
export function AuthHydrator({ user }: { user: Profile }) {
  const setUser = useAuthStore((state) => state.setUser);
  useEffect(() => {
    setUser(user);
  }, [user, setUser]);
  return null;
}