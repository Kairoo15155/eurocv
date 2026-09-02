/**
 * User-facing AI errors. Internal details (SDK messages, status codes,
 * stack traces) never leave the server; only `userMessage` is returned.
 */
export class AIServiceError extends Error {
  constructor(
    public readonly userMessage: string,
    public readonly status: number = 502,
    cause?: unknown,
  ) {
    super(userMessage, { cause });
    this.name = "AIServiceError";
  }
}

export const GENERIC_GENERATION_MESSAGE = "We couldn't generate your CV right now. Please try again.";
export const GENERIC_REVIEW_MESSAGE = "We couldn't review your CV right now. Please try again.";
export const NOT_CONFIGURED_MESSAGE = "AI generation is not configured on this server yet.";
