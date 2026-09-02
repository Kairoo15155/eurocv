import "server-only";

/**
 * Payment configuration, read from the environment on the server.
 *
 * Paddle acts as merchant of record: it charges the student, handles VAT,
 * and pays out to the EuroCV owner. EuroCV only needs to verify that a
 * transaction completed and remember who is entitled to Pro.
 */
export type PaddleEnvironment = "sandbox" | "production";

export interface PaymentsConfig {
  configured: boolean;
  environment: PaddleEnvironment;
  apiKey: string;
  apiUrl: string;
  priceId: string;
  clientToken: string;
}

export function getPaymentsConfig(): PaymentsConfig {
  const apiKey = process.env.PADDLE_API_KEY ?? "";
  const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID ?? "";
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";
  const environment = readEnvironment(Boolean(apiKey || priceId || clientToken));
  const apiUrl =
    process.env.PADDLE_API_URL ??
    (environment === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com");
  return {
    configured: Boolean(apiKey && priceId && clientToken),
    environment,
    apiKey,
    apiUrl,
    priceId,
    clientToken,
  };
}

/**
 * The environment is never defaulted: running live keys against sandbox (or
 * the reverse) would silently break payments, so any Paddle configuration
 * without an explicit PADDLE_ENVIRONMENT is a startup error.
 */
function readEnvironment(anyPaddleVarSet: boolean): PaddleEnvironment {
  const value = process.env.PADDLE_ENVIRONMENT;
  if (value === "sandbox" || value === "production") return value;
  if (anyPaddleVarSet) {
    throw new Error(
      `PADDLE_ENVIRONMENT must be "sandbox" or "production" when Paddle variables are set (got ${JSON.stringify(value ?? null)}).`,
    );
  }
  return "sandbox";
}

/** Local/testing switch that lets the placeholder checkout grant Pro. Never enable in production. */
export function devUnlockEnabled(): boolean {
  return process.env.EUROCV_DEV_UNLOCK === "true" && process.env.NODE_ENV !== "production";
}

export function getSessionSecret(): string | null {
  const secret = process.env.EUROCV_SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV !== "production") return "eurocv-dev-secret-not-for-production";
  return null;
}
