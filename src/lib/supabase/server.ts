import "server-only";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

/** Server Components / Server Actions / Route Handlers using next/headers cookies. */
export async function createServerSupabase(): Promise<SupabaseClient | null> {
  const cfg = getSupabaseConfig();
  if (!cfg) return null;
  const store = await cookies();
  return createServerClient(cfg.url, cfg.anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Called from a Server Component: the proxy refreshes sessions instead.
        }
      },
    },
  });
}

/** Read-only session client for Route Handlers, built from the request cookies. */
export function createRequestSupabase(request: NextRequest): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  if (!cfg) return null;
  return createServerClient(cfg.url, cfg.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: () => {},
    },
  });
}

/**
 * Service-role client for trusted server operations (recording purchases,
 * attaching them to accounts). Never expose this to the browser.
 */
export function createAdminSupabase(): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!cfg || !serviceKey) return null;
  return createClient(cfg.url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
