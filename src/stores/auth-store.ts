import { create } from "zustand";
import type { Profile } from "@/types/api";

interface AuthState {
  user: Profile | null;
  setUser: (user: Profile | null) => void;
}

// Holds the signed-in user for client components (sidebar, role-based UI).
// The layout fetches /users/me on the server and hydrates this store.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));