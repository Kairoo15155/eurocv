"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Plan = "free" | "pro";

/**
 * Entitlements for the MVP live in the browser. Once authentication and
 * payments exist this becomes a server-backed session; the hook shape is
 * designed so consumers don't need to change.
 */
interface UserStore {
  plan: Plan;
  purchasedAt: string | null;
  hasHydrated: boolean;
  setHasHydrated: () => void;
  upgradeToPro: () => void;
  resetPlan: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      plan: "free",
      purchasedAt: null,
      hasHydrated: false,
      setHasHydrated: () => set({ hasHydrated: true }),
      upgradeToPro: () => set({ plan: "pro", purchasedAt: new Date().toISOString() }),
      resetPlan: () => set({ plan: "free", purchasedAt: null }),
    }),
    {
      name: "eurocv:user",
      version: 1,
      partialize: (s) => ({ plan: s.plan, purchasedAt: s.purchasedAt }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(),
    },
  ),
);

export function useIsPro(): boolean {
  return useUserStore((s) => s.plan === "pro");
}
