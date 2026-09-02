import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getUserFromRequest, type SessionUser } from "@/lib/auth/session";
import { createAdminSupabase } from "@/lib/supabase/server";
import { getSessionSecret } from "./config";

/**
 * Pro entitlement.
 *
 * Signed-in users: a row in `purchases` (matched by user id, or by the email
 * Paddle has for the purchase) grants Pro. Anonymous users: a signed,
 * httpOnly cookie issued after a verified purchase. When an anonymous buyer
 * later signs in, the cookie's purchase is attached to the account.
 */

export const ENTITLEMENT_COOKIE = "eurocv_pro";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export interface Entitlement {
  plan: "free" | "pro";
  email: string | null;
  transactionId: string | null;
  user: SessionUser | null;
}

interface Payload {
  e: string;
  t: string;
  iat: number;
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createEntitlementToken(email: string, transactionId: string): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  const payload: Payload = { e: email, t: transactionId, iat: Date.now() };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data, secret)}`;
}

function parseCookieToken(token: string | undefined | null): { email: string; transactionId: string } | null {
  const secret = getSessionSecret();
  if (!token || !secret) return null;
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;
  const expected = sign(data, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as Payload;
    if (!payload.e || !payload.t) return null;
    if (Date.now() - payload.iat > MAX_AGE_SECONDS * 1000) return null;
    return { email: payload.e, transactionId: payload.t };
  } catch {
    return null;
  }
}

interface PurchaseRow {
  user_id: string | null;
  email: string;
  paddle_transaction_id: string;
}

/** Records a verified purchase (idempotent per transaction). No-op without a database. */
export async function recordPurchase(email: string, transactionId: string, userId: string | null): Promise<void> {
  const admin = createAdminSupabase();
  if (!admin) return;
  const { error } = await admin
    .from("purchases")
    .upsert(
      { email: email.toLowerCase(), paddle_transaction_id: transactionId, ...(userId ? { user_id: userId } : {}) },
      { onConflict: "paddle_transaction_id" },
    );
  if (error) console.error("[eurocv] recordPurchase failed", error.message);
}

async function findPurchaseForUser(user: SessionUser): Promise<PurchaseRow | null> {
  const admin = createAdminSupabase();
  if (!admin) return null;
  const byUser = await admin
    .from("purchases")
    .select("user_id,email,paddle_transaction_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle<PurchaseRow>();
  if (byUser.data) return byUser.data;

  const byEmail = await admin
    .from("purchases")
    .select("user_id,email,paddle_transaction_id")
    .ilike("email", user.email)
    .is("user_id", null)
    .limit(1)
    .maybeSingle<PurchaseRow>();
  if (byEmail.data) {
    await admin.from("purchases").update({ user_id: user.id }).eq("paddle_transaction_id", byEmail.data.paddle_transaction_id);
    return { ...byEmail.data, user_id: user.id };
  }
  return null;
}

export async function resolveEntitlement(request: NextRequest): Promise<Entitlement> {
  const cookie = parseCookieToken(request.cookies.get(ENTITLEMENT_COOKIE)?.value);
  const user = await getUserFromRequest(request);

  if (user) {
    const purchase = await findPurchaseForUser(user);
    if (purchase) return { plan: "pro", email: purchase.email, transactionId: purchase.paddle_transaction_id, user };
    if (cookie) {
      // Anonymous purchase made on this browser: attach it to the account.
      await recordPurchase(cookie.email, cookie.transactionId, user.id);
      return { plan: "pro", email: cookie.email, transactionId: cookie.transactionId, user };
    }
    return { plan: "free", email: user.email, transactionId: null, user };
  }

  if (cookie) return { plan: "pro", email: cookie.email, transactionId: cookie.transactionId, user: null };
  return { plan: "free", email: null, transactionId: null, user: null };
}

export function grantEntitlement(response: NextResponse, email: string, transactionId: string): boolean {
  const token = createEntitlementToken(email, transactionId);
  if (!token) return false;
  response.cookies.set({
    name: ENTITLEMENT_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return true;
}

export const PRO_REQUIRED_MESSAGE = "This feature is part of EuroCV Pro.";

/** Returns a 402 response when the caller is not on Pro, otherwise null. */
export async function requirePro(request: NextRequest): Promise<NextResponse | null> {
  const entitlement = await resolveEntitlement(request);
  if (entitlement.plan === "pro") return null;
  return NextResponse.json({ error: PRO_REQUIRED_MESSAGE, code: "pro_required" }, { status: 402 });
}
