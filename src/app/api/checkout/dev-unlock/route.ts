import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/http";
import { devUnlockEnabled } from "@/lib/payments/config";
import { grantEntitlement } from "@/lib/payments/entitlement";

export const runtime = "nodejs";

/** Development-only: grants Pro without a payment when EUROCV_DEV_UNLOCK=true. */
export async function POST() {
  if (!devUnlockEnabled()) return errorResponse("Not available.", 404);
  const response = NextResponse.json({ plan: "pro", email: "dev@localhost" });
  grantEntitlement(response, "dev@localhost", "dev-unlock");
  return response;
}
