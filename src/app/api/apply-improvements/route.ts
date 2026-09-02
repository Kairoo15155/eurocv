import { NextResponse } from "next/server";
import { z } from "zod";
import { applyImprovements } from "@/lib/ai/generate";
import { GENERIC_GENERATION_MESSAGE } from "@/lib/ai/errors";
import { cvDataSchema, cvDocumentSchema, cvReviewSchema } from "@/lib/cv/schema";
import { handleRouteError, parseBody } from "@/lib/api/http";
import { requirePro } from "@/lib/payments/entitlement";

export const runtime = "nodejs";
export const maxDuration = 120;

const bodySchema = z.object({
  document: cvDocumentSchema,
  data: cvDataSchema,
  suggestions: cvReviewSchema.shape.suggestions.min(1),
});

export async function POST(request: Request) {
  const gate = requirePro(request);
  if (gate) return gate;
  const body = await parseBody(request, bodySchema);
  if (!body.ok) return body.response;
  try {
    const document = await applyImprovements(body.data.document, body.data.suggestions, body.data.data);
    return NextResponse.json({ document });
  } catch (error) {
    return handleRouteError(error, GENERIC_GENERATION_MESSAGE);
  }
}
