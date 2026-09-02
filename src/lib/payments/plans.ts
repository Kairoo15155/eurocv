/**
 * Plans shown on the pricing page and in checkout. Edit here to change
 * copy or features; the Pro price itself lives in Paddle and is referenced
 * by its price ID. Prices displayed to visitors always come from Paddle's
 * price preview so they are localised and include tax where applicable.
 */
export interface Plan {
  id: "free" | "pro";
  name: string;
  description: string;
  features: string[];
  /** Fallback label used only when Paddle can't be reached. */
  fallbackPrice: string;
  /** Paddle price ID (one-time). Only paid plans have one. */
  priceId: string | null;
  cta: string;
  highlighted: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Everything you need to build and preview your CV.",
    features: ["Create CV", "Basic template", "AI generation", "Preview"],
    fallbackPrice: "€0",
    priceId: null,
    cta: "Start for free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Download, polish and keep several versions of your CV.",
    features: [
      "PDF download",
      "All templates",
      "AI CV improvement",
      "Multiple CV versions",
      "Future motivation-letter feature",
    ],
    fallbackPrice: "€4.99",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID ?? null,
    cta: "Get Pro",
    highlighted: true,
  },
];

export const PRO_PLAN = PLANS.find((p) => p.id === "pro")!;
