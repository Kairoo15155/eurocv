import "server-only";
import { z } from "zod";
import { cvDocumentSchema, cvReviewSchema } from "@/lib/cv/schema";
import { buildHeader, toDocument } from "@/lib/cv/to-document";
import type { CVData, CVDocument, CVReview, ReviewSuggestion } from "@/lib/cv/types";
import { CV_MODEL, getGemini, hasApiKey } from "./client";
import {
  AIServiceError,
  GENERIC_GENERATION_MESSAGE,
  GENERIC_REVIEW_MESSAGE,
  NOT_CONFIGURED_MESSAGE,
} from "./errors";
import {
  APPLY_SYSTEM_PROMPT,
  GENERATE_SYSTEM_PROMPT,
  REVIEW_SYSTEM_PROMPT,
  applicationContext,
} from "./prompts";

/**
 * Server-side Gemini calls. Each function returns validated, typed data and
 * throws `AIServiceError` with a safe user-facing message on failure.
 */

export async function generateCV(data: CVData): Promise<CVDocument> {
  const draft = toDocument(data);
  const output = await structuredCall(
    GENERATE_SYSTEM_PROMPT,
    [
      applicationContext(data.application),
      "",
      "CV draft (JSON):",
      JSON.stringify(draft, null, 2),
    ].join("\n"),
    cvDocumentSchema,
    GENERIC_GENERATION_MESSAGE,
  );
  return harden(output, data, draft);
}

export async function reviewCV(document: CVDocument, data: CVData): Promise<CVReview> {
  return structuredCall(
    REVIEW_SYSTEM_PROMPT,
    [applicationContext(data.application), "", "CV (JSON):", JSON.stringify(document, null, 2)].join(
      "\n",
    ),
    cvReviewSchema,
    GENERIC_REVIEW_MESSAGE,
  );
}

export async function applyImprovements(
  document: CVDocument,
  suggestions: ReviewSuggestion[],
  data: CVData,
): Promise<CVDocument> {
  const output = await structuredCall(
    APPLY_SYSTEM_PROMPT,
    [
      applicationContext(data.application),
      "",
      "Accepted suggestions (JSON):",
      JSON.stringify(suggestions, null, 2),
      "",
      "Current CV (JSON):",
      JSON.stringify(document, null, 2),
    ].join("\n"),
    cvDocumentSchema,
    GENERIC_GENERATION_MESSAGE,
  );
  return harden(output, data, document);
}

/* ------------------------------------------------------------------ */

async function structuredCall<T>(
  system: string,
  userContent: string,
  schema: z.ZodType<T>,
  userMessage: string,
): Promise<T> {
  if (!hasApiKey()) {
    throw new AIServiceError(NOT_CONFIGURED_MESSAGE, 503);
  }
  const client = getGemini();
  try {
    const interaction = await client.interactions.create({
      model: CV_MODEL,
      system_instruction: system,
      input: userContent,
      response_format: { type: "text", mime_type: "application/json", schema: toJsonSchema(schema) },
      generation_config: { max_output_tokens: 16000, thinking_level: "low" },
      store: false,
    });

    if (interaction.status !== "completed" || !interaction.output_text) {
      console.error(
        `[eurocv] Gemini interaction ${interaction.status}`,
        interaction.errors?.map((e) => e.code).join(",") ?? "",
      );
      throw new AIServiceError(userMessage, 502);
    }
    const parsed = schema.safeParse(JSON.parse(interaction.output_text));
    if (!parsed.success) {
      console.error("[eurocv] Gemini output failed schema validation");
      throw new AIServiceError(userMessage, 502);
    }
    return parsed.data;
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    const status = httpStatus(error);
    if (status === 401 || status === 403) {
      console.error("[eurocv] Gemini authentication failed");
      throw new AIServiceError(NOT_CONFIGURED_MESSAGE, 503, error);
    }
    if (status === 429) {
      throw new AIServiceError("We're receiving a lot of requests right now. Please try again in a moment.", 429, error);
    }
    if (status !== undefined) {
      console.error(`[eurocv] Gemini API error ${status}`);
      throw new AIServiceError(userMessage, 502, error);
    }
    if (error instanceof SyntaxError) {
      console.error("[eurocv] Gemini returned invalid JSON");
      throw new AIServiceError(userMessage, 502, error);
    }
    console.error("[eurocv] Unexpected AI error", error instanceof Error ? error.name : error);
    throw new AIServiceError(userMessage, 502, error);
  }
}

/** Gemini accepts a JSON Schema subset; the draft marker is not part of it. */
function toJsonSchema(schema: z.ZodType): Record<string, unknown> {
  const { $schema: _draft, ...rest } = z.toJSONSchema(schema);
  void _draft;
  return rest;
}

/** The SDK's interaction errors carry the HTTP status as `status` or `statusCode`. */
function httpStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const e = error as { status?: unknown; statusCode?: unknown };
  if (typeof e.status === "number") return e.status;
  if (typeof e.statusCode === "number") return e.statusCode;
  return undefined;
}

/**
 * Defence in depth against fabrication: contact details, languages,
 * certifications and skills are copied back from the student's own data,
 * and entry counts must match the source or we fall back to the source
 * entries for that section.
 */
function harden(output: CVDocument, data: CVData, source: CVDocument): CVDocument {
  const keepCount = <T>(generated: T[], original: T[]): T[] =>
    generated.length === original.length ? generated : original;

  return {
    ...output,
    header: buildHeader(data),
    education: keepCount(output.education, source.education),
    experience: keepCount(output.experience, source.experience),
    projects: keepCount(output.projects, source.projects),
    achievements: keepCount(output.achievements, source.achievements),
    activities: keepCount(output.activities, source.activities),
    skills: {
      technical: filterToSource(output.skills.technical, source.skills.technical),
      soft: filterToSource(output.skills.soft, source.skills.soft),
    },
    languages: source.languages,
    certifications: source.certifications,
  };
}

function filterToSource(generated: string[], original: string[]): string[] {
  const allowed = new Set(original.map((s) => s.toLowerCase()));
  const kept = generated.filter((s) => allowed.has(s.toLowerCase()));
  return kept.length > 0 || original.length === 0 ? dedupe(kept) : original;
}

function dedupe(list: string[]): string[] {
  const seen = new Set<string>();
  return list.filter((s) => {
    const k = s.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
