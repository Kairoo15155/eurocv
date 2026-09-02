"use client";

import { useEffect } from "react";
import { create } from "zustand";

export type Plan = "free" | "pro";

export interface PaymentsInfo {
  configured: boolean;
  environment: "sandbox" | "production";
  clientToken: string | null;
  priceId: string | null;
}

/**
 * Entitlement state, loaded from the server. The server keeps the Pro
 * entitlement in a signed cookie, so this store is only a cache of what the
 * server said; `refresh()` re-reads it after checkout or restore.
 */
export interface AccountUser {
  id: string;
  email: string;
  name: string | null;
}

interface UserStore {
  plan: Plan;
  email: string | null;
  user: AccountUser | null;
  payments: PaymentsInfo;
  devUnlock: boolean;
  hasHydrated: boolean;
  refresh: () => Promise<void>;
}

let inflight: Promise<void> | null = null;

export const useUserStore = create<UserStore>()((set) => ({
  plan: "free",
  email: null,
  user: null,
  payments: { configured: false, environment: "sandbox", clientToken: null, priceId: null },
  devUnlock: false,
  hasHydrated: false,
  refresh: () => {
    if (inflight) return inflight;
    inflight = fetch("/api/entitlement", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Partial<UserStore> | null) => {
        set({
          plan: data?.plan === "pro" ? "pro" : "free",
          email: data?.email ?? null,
          user: data?.user ?? null,
          payments: data?.payments ?? { configured: false, environment: "sandbox", clientToken: null, priceId: null },
          devUnlock: Boolean(data?.devUnlock),
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

/** Returns the entitlement, loading it from the server on first use. */
export function useEntitlement(): UserStore {
  const store = useUserStore();
  const { hasHydrated, refresh } = store;
  useEffect(() => {
    if (!hasHydrated) void refresh();
  }, [hasHydrated, refresh]);
  return store;
}

export function useIsPro(): boolean {
  return useEntitlement().plan === "pro";
}
