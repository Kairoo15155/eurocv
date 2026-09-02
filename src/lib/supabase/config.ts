/**
 * Supabase configuration. Accounts are optional: when these variables are
 * missing the app runs anonymously with browser storage, exactly as before.
 */
export interface SupabasePublicConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function authEnabled(): boolean {
  return getSupabaseConfig() !== null;
}

export function googleAuthEnabled(): boolean {
  return authEnabled() && process.env.NEXT_PUBLIC_AUTH_GOOGLE === "true";
}
