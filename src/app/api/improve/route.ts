import { NextResponse } from "next/server";
import { z } from "zod";
import { reviewCV } from "@/lib/ai/generate";
import { GENERIC_REVIEW_MESSAGE } from "@/lib/ai/errors";
import { cvDataSchema, cvDocumentSchema } from "@/lib/cv/schema";
import { handleRouteError, parseBody } from "@/lib/api/http";

export const runtime = "nodejs";
export const maxDuration = 120;

const bodySchema = z.object({ document: cvDocumentSchema, data: cvDataSchema });

export async function POST(request: Request) {
  const body = await parseBody(request, bodySchema);
  if (!body.ok) return body.response;
  try {
    const review = await reviewCV(body.data.document, body.data.data);
    return NextResponse.json({ review });
  } catch (error) {
    return handleRouteError(error, GENERIC_REVIEW_MESSAGE);
  }
}
