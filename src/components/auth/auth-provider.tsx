"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useCVStore } from "@/lib/store/cv-store";
import { startCVSync } from "@/lib/store/cv-sync";
import { useUserStore } from "@/lib/store/user-store";
import { getBrowserSupabase } from "@/lib/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  enabled: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({ user: null, enabled: false, signOut: async () => {} });

function toAuthUser(user: User | null | undefined): AuthUser | null {
  if (!user?.email) return null;
  const meta = user.user_metadata as { full_name?: string; name?: string } | undefined;
  return { id: user.id, email: user.email, name: meta?.full_name ?? meta?.name ?? null };
}

export function AuthProvider({
  initialUser,
  enabled,
  children,
}: {
  initialUser: AuthUser | null;
  enabled: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  // Track auth changes made in the browser (sign-in form, sign-out, other tabs).
  useEffect(() => {
    const supabase = enabled ? getBrowserSupabase() : null;
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const next = toAuthUser(session?.user);
      setUser((prev) => (prev?.id === next?.id ? prev : next));
      void useUserStore.getState().refresh();
    });
    return () => data.subscription.unsubscribe();
  }, [enabled]);

  // Keep the signed-in user's CVs in the database.
  useEffect(() => {
    const supabase = enabled ? getBrowserSupabase() : null;
    if (!supabase || !user) return;
    return startCVSync(supabase, user.id);
  }, [enabled, user]);

  const signOut = useCallback(async () => {
    const supabase = getBrowserSupabase();
    await supabase?.auth.signOut();
    // Don't leave the account's CVs behind on a shared computer.
    useCVStore.setState({ cvs: {} });
    setUser(null);
    await useUserStore.getState().refresh();
    router.push("/");
    router.refresh();
  }, [router]);

  const value = useMemo(() => ({ user, enabled, signOut }), [user, enabled, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
