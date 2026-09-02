import { NextResponse } from "next/server";
import { z } from "zod";
import { AIServiceError } from "@/lib/ai/errors";

/** Parses a JSON body against a schema, returning a 400 response on failure. */
export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return { ok: false, response: errorResponse("Invalid request.", 400) };
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    return { ok: false, response: errorResponse("Some of the information is missing or invalid.", 400) };
  }
  return { ok: true, data: result.data };
}

export function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/** Converts any thrown error into a safe response without leaking internals. */
export function handleRouteError(error: unknown, fallback: string): NextResponse {
  if (error instanceof AIServiceError) {
    return errorResponse(error.userMessage, error.status);
  }
  console.error("[eurocv] route error", error instanceof Error ? error.message : error);
  return errorResponse(fallback, 500);
}
