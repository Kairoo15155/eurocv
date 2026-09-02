/**
 * Authentication seam.
 *
 * The MVP has no accounts: every visitor is anonymous and their CVs live in
 * the browser. Pro entitlement is a signed cookie issued after a verified
 * Paddle purchase (see `src/lib/payments/entitlement.ts`). When Google/email
 * login is added, implement `getSession` against the auth provider and make
 * `readEntitlement` look up the user's purchases instead of the cookie.
 */
export interface Session {
  user: { id: string; email: string; name: string | null } | null;
  plan: "free" | "pro";
}

export async function getSession(): Promise<Session> {
  return { user: null, plan: "free" };
}

export const AUTH_ENABLED = false;
