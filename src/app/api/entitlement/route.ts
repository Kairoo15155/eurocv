import { NextResponse } from "next/server";
import { devUnlockEnabled, getPaymentsConfig } from "@/lib/payments/config";
import { readEntitlement } from "@/lib/payments/entitlement";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tells the client who it is (plan) and how checkout should behave. */
export async function GET(request: Request) {
  const entitlement = readEntitlement(request);
  const payments = getPaymentsConfig();
  return NextResponse.json(
    {
      plan: entitlement.plan,
      email: entitlement.email,
      payments: {
        configured: payments.configured,
        environment: payments.environment,
        clientToken: payments.configured ? payments.clientToken : null,
        priceId: payments.configured ? payments.priceId : null,
      },
      devUnlock: devUnlockEnabled(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
