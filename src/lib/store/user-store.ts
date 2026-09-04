"use client";

import { useEffect } from "react";
import { create } from "zustand";

export interface AccountUser {
  id: string;
  email: string;
  name: string | null;
}

/**
 * Session state, loaded from the server. This store is only a cache of what
 * the server said; `refresh()` re-reads it after sign-in or sign-out.
 */
interface UserStore {
  user: AccountUser | null;
  /** Whether the server can run AI generation (a Gemini key is configured). */
  aiAvailable: boolean;
  hasHydrated: boolean;
  refresh: () => Promise<void>;
}

let inflight: Promise<void> | null = null;

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  aiAvailable: true,
  hasHydrated: false,
  refresh: () => {
    if (inflight) return inflight;
    inflight = fetch("/api/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { user?: AccountUser | null; ai?: { available?: boolean } } | null) => {
        set({
          user: data?.user ?? null,
          aiAvailable: data?.ai?.available !== false,
          hasHydrated: true,
        });
      })
      .catch(() => set({ hasHydrated: true }))
      .finally(() => {
        inflight = null;
      });
    return inflight;
  },
}));

/** Returns the session state, loading it from the server on first use. */
export function useAccount(): UserStore {
  const store = useUserStore();
  const { hasHydrated, refresh } = store;
  useEffect(() => {
    if (!hasHydrated) void refresh();
  }, [hasHydrated, refresh]);
  return store;
}
