import { NextResponse, type NextRequest } from "next/server";
import { devUnlockEnabled, getPaymentsConfig } from "@/lib/payments/config";
import { grantEntitlement, recordPurchase, resolveEntitlement } from "@/lib/payments/entitlement";
import { findPurchaseByEmail } from "@/lib/payments/paddle";
import { hasApiKey } from "@/lib/ai/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tells the client who it is (plan, account) and how checkout should behave. */
export async function GET(request: NextRequest) {
  let entitlement = await resolveEntitlement(request);
  const payments = getPaymentsConfig();

  // A signed-in user who paid on another device: look the purchase up in Paddle once.
  let response: NextResponse | null = null;
  if (entitlement.plan === "free" && entitlement.user && payments.configured) {
    try {
      const purchase = await findPurchaseByEmail(entitlement.user.email);
      if (purchase) {
        await recordPurchase(purchase.email, purchase.transactionId, entitlement.user.id);
        entitlement = { ...entitlement, plan: "pro", email: purchase.email, transactionId: purchase.transactionId };
        response = NextResponse.json({});
        grantEntitlement(response, purchase.email, purchase.transactionId);
      }
    } catch (error) {
      console.warn("[eurocv] Paddle lookup failed", error instanceof Error ? error.message : error);
    }
  }

  const body = {
    plan: entitlement.plan,
    email: entitlement.email,
    user: entitlement.user ? { id: entitlement.user.id, email: entitlement.user.email, name: entitlement.user.name } : null,
    payments: {
      configured: payments.configured,
      environment: payments.environment,
      clientToken: payments.configured ? payments.clientToken : null,
      priceId: payments.configured ? payments.priceId : null,
    },
    devUnlock: devUnlockEnabled(),
    ai: { available: hasApiKey() },
  };
  const out = NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
  if (response) for (const c of response.cookies.getAll()) out.cookies.set(c);
  return out;
}
