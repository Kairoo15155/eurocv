"use client";

import { initializePaddle, type Paddle, type PaddleEventData } from "@paddle/paddle-js";
import type { PaymentsInfo } from "@/lib/store/user-store";

/**
 * One Paddle.js instance per page, shared by the pricing table and the
 * checkout. Event listeners register through `onPaddleEvent` so several
 * components can react to the same checkout without re-initialising.
 */
type Listener = (event: PaddleEventData) => void;

let instance: Promise<Paddle | undefined> | null = null;
const listeners = new Set<Listener>();

export function getPaddle(payments: PaymentsInfo): Promise<Paddle | undefined> {
  if (!payments.configured || !payments.clientToken) return Promise.resolve(undefined);
  if (!instance) {
    instance = initializePaddle({
      environment: payments.environment,
      token: payments.clientToken,
      eventCallback: (event) => listeners.forEach((l) => l(event)),
    });
  }
  return instance;
}

export function onPaddleEvent(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Localised, tax-inclusive total for a one-time price as Paddle formats it.
 * Pass `countryCode` only when known; otherwise Paddle detects it from the
 * visitor's IP address.
 */
export async function previewPrice(
  paddle: Paddle,
  priceId: string,
  countryCode?: string,
): Promise<string | null> {
  const result = await paddle.PricePreview({
    items: [{ priceId, quantity: 1 }],
    ...(countryCode ? { address: { countryCode } } : {}),
  });
  const line = result.data.details.lineItems.find((l) => l.price.id === priceId);
  return line?.formattedTotals.total ?? null;
}
