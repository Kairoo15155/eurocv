import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { cvDocumentSchema, cvReviewSchema } from "@/lib/cv/schema";
import { buildHeader, toDocument } from "@/lib/cv/to-document";
import type { CVData, CVDocument, CVReview, ReviewSuggestion } from "@/lib/cv/types";
import { CV_MODEL, getAnthropic, hasApiKey } from "./client";
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
 * Server-side Claude calls. Each function returns validated, typed data and
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
  const client = getAnthropic();
  try {
    const response = await client.beta.messages.parse({
      model: CV_MODEL,
      max_tokens: 16000,
      system,
      messages: [{ role: "user", content: userContent }],
      output_config: { format: zodOutputFormat(schema), effort: "medium" },
      // Route safety-classifier declines to Anthropic's recommended fallback
      // model server-side instead of surfacing a refusal to the student.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });

    if (response.stop_reason === "refusal") {
      throw new AIServiceError(userMessage, 502);
    }
    if (response.stop_reason === "max_tokens") {
      throw new AIServiceError(userMessage, 502);
    }
    const parsed = response.parsed_output;
    if (!parsed) {
      throw new AIServiceError(userMessage, 502);
    }
    return schema.parse(parsed);
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("[eurocv] Anthropic authentication failed");
      throw new AIServiceError(NOT_CONFIGURED_MESSAGE, 503, error);
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new AIServiceError("We're receiving a lot of requests right now. Please try again in a moment.", 429, error);
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`[eurocv] Anthropic API error ${error.status}`);
      throw new AIServiceError(userMessage, 502, error);
    }
    console.error("[eurocv] Unexpected AI error", error instanceof Error ? error.name : error);
    throw new AIServiceError(userMessage, 502, error);
  }
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
