import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getSessionSecret } from "./config";

/**
 * Pro entitlement stored in a signed, httpOnly cookie.
 *
 * This is the MVP substitute for a user account: after Paddle confirms a
 * purchase the server issues the cookie, and every Pro-only route verifies
 * it. When accounts arrive, `readEntitlement` becomes a session lookup and
 * nothing else needs to change.
 */

export const ENTITLEMENT_COOKIE = "eurocv_pro";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export interface Entitlement {
  plan: "free" | "pro";
  email: string | null;
  transactionId: string | null;
}

interface Payload {
  e: string;
  t: string;
  iat: number;
}

const FREE: Entitlement = { plan: "free", email: null, transactionId: null };

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

export function parseEntitlementToken(token: string | undefined | null): Entitlement {
  const secret = getSessionSecret();
  if (!token || !secret) return FREE;
  const [data, signature] = token.split(".");
  if (!data || !signature) return FREE;
  const expected = sign(data, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return FREE;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as Payload;
    if (!payload.e || !payload.t) return FREE;
    if (Date.now() - payload.iat > MAX_AGE_SECONDS * 1000) return FREE;
    return { plan: "pro", email: payload.e, transactionId: payload.t };
  } catch {
    return FREE;
  }
}

function cookieFromHeader(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export function readEntitlement(request: Request): Entitlement {
  return parseEntitlementToken(cookieFromHeader(request.headers.get("cookie"), ENTITLEMENT_COOKIE));
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
export function requirePro(request: Request): NextResponse | null {
  if (readEntitlement(request).plan === "pro") return null;
  return NextResponse.json({ error: PRO_REQUIRED_MESSAGE, code: "pro_required" }, { status: 402 });
}
