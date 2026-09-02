import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { errorResponse, parseBody } from "@/lib/api/http";
import { getPaymentsConfig } from "@/lib/payments/config";
import { grantEntitlement, recordPurchase } from "@/lib/payments/entitlement";
import { getUserFromRequest } from "@/lib/auth/session";
import { findPurchaseByEmail } from "@/lib/payments/paddle";

export const runtime = "nodejs";

const bodySchema = z.object({ email: z.string().email().max(160) });

/** Re-issues the Pro cookie on a new browser or device for a past purchase. */
export async function POST(request: NextRequest) {
  if (!getPaymentsConfig().configured) return errorResponse("Payments are not available yet.", 503);
  const body = await parseBody(request, bodySchema);
  if (!body.ok) return body.response;
  try {
    const purchase = await findPurchaseByEmail(body.data.email);
    if (!purchase) {
      return errorResponse("We couldn't find a EuroCV Pro purchase for that email address.", 404);
    }
    const user = await getUserFromRequest(request);
    await recordPurchase(purchase.email, purchase.transactionId, user?.id ?? null);
    const response = NextResponse.json({ plan: "pro", email: purchase.email });
    if (!grantEntitlement(response, purchase.email, purchase.transactionId)) {
      return errorResponse("Payments are not available yet.", 503);
    }
    return response;
  } catch (error) {
    console.error("[eurocv] restore failed", error instanceof Error ? error.message : error);
    return errorResponse("We couldn't check your purchase right now. Please try again.", 502);
  }
}
