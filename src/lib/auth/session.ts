import "server-only";
import type { NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createRequestSupabase, createServerSupabase } from "@/lib/supabase/server";
export { authEnabled, googleAuthEnabled } from "@/lib/supabase/config";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

export interface Session {
  user: SessionUser | null;
}

export function toSessionUser(user: User | null | undefined): SessionUser | null {
  if (!user?.email) return null;
  const meta = user.user_metadata as { full_name?: string; name?: string } | undefined;
  return { id: user.id, email: user.email, name: meta?.full_name ?? meta?.name ?? null };
}

/** Current user for Server Components and Server Actions. */
export async function getSession(): Promise<Session> {
  const supabase = await createServerSupabase();
  if (!supabase) return { user: null };
  const { data } = await supabase.auth.getUser();
  return { user: toSessionUser(data.user) };
}

/** Current user for Route Handlers. */
export async function getUserFromRequest(request: NextRequest): Promise<SessionUser | null> {
  const supabase = createRequestSupabase(request);
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return toSessionUser(data.user);
}
