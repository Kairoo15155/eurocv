import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Return URL for email links and Google sign-in. Handles both the PKCE
 * `code` form and the `token_hash` form, creates the session cookie, and
 * sends the user on to `next`.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next") ?? "/dashboard";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const supabase = await createServerSupabase();

  if (supabase) {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(safeNext, url.origin));
      console.warn("[eurocv] auth code exchange failed:", error.message);
    } else if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as EmailOtpType });
      if (!error) return NextResponse.redirect(new URL(safeNext, url.origin));
      console.warn("[eurocv] auth link verification failed:", error.message);
    }
  }
  return NextResponse.redirect(new URL("/signin?error=link", url.origin));
}
