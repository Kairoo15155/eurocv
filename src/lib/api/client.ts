"use client";

import type { CVData, CVDocument, CVReview, ReviewSuggestion, TemplateId } from "@/lib/cv/types";

/**
 * Typed client for the app's own API routes. Errors are surfaced as
 * `ApiError` with the server's user-safe message.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function post<T>(url: string, body: unknown, fallback: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("We couldn't reach EuroCV. Check your connection and try again.", 0);
  }
  if (!response.ok) {
    const message = await response
      .json()
      .then((j: { error?: string }) => j.error)
      .catch(() => undefined);
    throw new ApiError(message || fallback, response.status);
  }
  return response.json() as Promise<T>;
}

export async function generateCVRequest(data: CVData): Promise<CVDocument> {
  const { document } = await post<{ document: CVDocument }>(
    "/api/generate",
    { data },
    "We couldn't generate your CV right now. Please try again.",
  );
  return document;
}

export async function reviewCVRequest(document: CVDocument, data: CVData): Promise<CVReview> {
  const { review } = await post<{ review: CVReview }>(
    "/api/improve",
    { document, data },
    "We couldn't review your CV right now. Please try again.",
  );
  return review;
}

export async function applyImprovementsRequest(
  document: CVDocument,
  suggestions: ReviewSuggestion[],
  data: CVData,
): Promise<CVDocument> {
  const res = await post<{ document: CVDocument }>(
    "/api/apply-improvements",
    { document, suggestions, data },
    "We couldn't apply the improvements right now. Please try again.",
  );
  return res.document;
}

export async function downloadPdf(document: CVDocument, templateId: TemplateId): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ document, templateId }),
    });
  } catch {
    throw new ApiError("We couldn't reach EuroCV. Check your connection and try again.", 0);
  }
  if (!response.ok) {
    const message = await response
      .json()
      .then((j: { error?: string }) => j.error)
      .catch(() => undefined);
    throw new ApiError(message || "We couldn't create your PDF right now. Please try again.", response.status);
  }
  const disposition = response.headers.get("Content-Disposition") ?? "";
  const match = /filename="([^"]+)"/.exec(disposition);
  const filename = match?.[1] ?? "EuroCV.pdf";
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement("a");
  a.href = url;
  a.download = filename;
  window.document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
