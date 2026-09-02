"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

let client: SupabaseClient | null = null;

/** Browser Supabase client (singleton). Returns null when accounts are disabled. */
export function getBrowserSupabase(): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  if (!cfg) return null;
  if (!client) client = createBrowserClient(cfg.url, cfg.anonKey);
  return client;
}
