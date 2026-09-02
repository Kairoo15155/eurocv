import { NextResponse } from "next/server";
import { z } from "zod";
import { generateCV } from "@/lib/ai/generate";
import { GENERIC_GENERATION_MESSAGE } from "@/lib/ai/errors";
import { cvDataSchema } from "@/lib/cv/schema";
import { handleRouteError, parseBody } from "@/lib/api/http";

export const runtime = "nodejs";
export const maxDuration = 120;

const bodySchema = z.object({ data: cvDataSchema });

export async function POST(request: Request) {
  const body = await parseBody(request, bodySchema);
  if (!body.ok) return body.response;
  try {
    const document = await generateCV(body.data.data);
    return NextResponse.json({ document });
  } catch (error) {
    return handleRouteError(error, GENERIC_GENERATION_MESSAGE);
  }
}
