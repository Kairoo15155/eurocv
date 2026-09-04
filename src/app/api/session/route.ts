import { NextResponse, type NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { hasApiKey } from "@/lib/ai/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tells the client who it is (account, if any) and whether AI generation is available. */
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  const body = {
    user: user ? { id: user.id, email: user.email, name: user.name } : null,
    ai: { available: hasApiKey() },
  };
  return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
}
