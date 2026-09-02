import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { errorResponse, parseBody } from "@/lib/api/http";
import { getPaymentsConfig } from "@/lib/payments/config";
import { grantEntitlement, recordPurchase } from "@/lib/payments/entitlement";
import { getUserFromRequest } from "@/lib/auth/session";
import { verifyTransaction } from "@/lib/payments/paddle";

export const runtime = "nodejs";

const bodySchema = z.object({ transactionId: z.string().min(4).max(64) });

/** Called by the checkout page after Paddle reports `checkout.completed`. */
export async function POST(request: NextRequest) {
  if (!getPaymentsConfig().configured) return errorResponse("Payments are not available yet.", 503);
  const body = await parseBody(request, bodySchema);
  if (!body.ok) return body.response;
  try {
    const purchase = await verifyTransaction(body.data.transactionId);
    if (!purchase) return errorResponse("We couldn't confirm this payment yet. Please try again in a moment.", 409);
    const user = await getUserFromRequest(request);
    await recordPurchase(purchase.email, purchase.transactionId, user?.id ?? null);
    const response = NextResponse.json({ plan: "pro", email: purchase.email });
    if (!grantEntitlement(response, purchase.email, purchase.transactionId)) {
      return errorResponse("Payments are not available yet.", 503);
    }
    return response;
  } catch (error) {
    console.error("[eurocv] checkout confirm failed", error instanceof Error ? error.message : error);
    return errorResponse("We couldn't confirm your payment right now. Please try again.", 502);
  }
}
