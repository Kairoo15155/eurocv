/**
 * Authentication seam.
 *
 * The MVP has no accounts: every visitor is anonymous and their CVs live in
 * the browser. When Google/email login is added, implement `getSession`
 * against the auth provider and the rest of the app keeps working through
 * this interface.
 */
export interface Session {
  user: { id: string; email: string; name: string | null } | null;
  plan: "free" | "pro";
}

export async function getSession(): Promise<Session> {
  return { user: null, plan: "free" };
}

export const AUTH_ENABLED = false;
