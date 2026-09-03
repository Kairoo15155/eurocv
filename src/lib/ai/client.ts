import "server-only";
import { GoogleGenAI } from "@google/genai";

/**
 * Server-only Gemini client. The API key is read from the environment on
 * the server; nothing in this module can be imported by client components.
 *
 * EuroCV runs on the Gemini API free tier (no billing required). Note that
 * Google may use free-tier content to improve its products; this is
 * disclosed on the privacy page.
 */
let client: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

/** Any model listed as "free of charge" on the Gemini pricing page works here. */
export const CV_MODEL = process.env.EUROCV_MODEL ?? "gemini-3.8-flash";

export function hasApiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}
