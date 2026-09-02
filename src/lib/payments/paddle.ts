import "server-only";
import { getPaymentsConfig } from "./config";

/**
 * Minimal Paddle Billing API client. Only the calls needed to confirm a
 * one-time purchase and to restore it later by email.
 */

interface PaddleTransaction {
  id: string;
  status: "draft" | "ready" | "billed" | "paid" | "completed" | "canceled" | "past_due";
  customer_id: string | null;
  items: { price: { id: string } }[];
}

interface PaddleCustomer {
  id: string;
  email: string;
}

export interface VerifiedPurchase {
  transactionId: string;
  email: string;
}

const PAID_STATUSES = new Set(["paid", "completed"]);

async function paddleGet<T>(path: string): Promise<T | null> {
  const config = getPaymentsConfig();
  const response = await fetch(`${config.apiUrl}${path}`, {
    headers: { Authorization: `Bearer ${config.apiKey}` },
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Paddle API ${response.status} for ${path.split("?")[0]}`);
  }
  const json = (await response.json()) as { data: T };
  return json.data;
}

/** Confirms that a transaction is paid and is for the EuroCV Pro price. */
export async function verifyTransaction(transactionId: string): Promise<VerifiedPurchase | null> {
  const config = getPaymentsConfig();
  const txn = await paddleGet<PaddleTransaction>(`/transactions/${encodeURIComponent(transactionId)}`);
  if (!txn || !PAID_STATUSES.has(txn.status)) return null;
  if (!txn.items.some((item) => item.price.id === config.priceId)) return null;
  if (!txn.customer_id) return null;
  const customer = await paddleGet<PaddleCustomer>(`/customers/${encodeURIComponent(txn.customer_id)}`);
  if (!customer?.email) return null;
  return { transactionId: txn.id, email: customer.email.toLowerCase() };
}

/** Finds a completed EuroCV Pro purchase for an email address, if any. */
export async function findPurchaseByEmail(email: string): Promise<VerifiedPurchase | null> {
  const config = getPaymentsConfig();
  const normalised = email.trim().toLowerCase();
  const customers = await paddleGet<PaddleCustomer[]>(`/customers?email=${encodeURIComponent(normalised)}`);
  if (!customers?.length) return null;
  for (const customer of customers) {
    const txns = await paddleGet<PaddleTransaction[]>(
      `/transactions?customer_id=${encodeURIComponent(customer.id)}&status=paid,completed`,
    );
    const match = txns?.find((t) => t.items.some((item) => item.price.id === config.priceId));
    if (match) return { transactionId: match.id, email: normalised };
  }
  return null;
}
