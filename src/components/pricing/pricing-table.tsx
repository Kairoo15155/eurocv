"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { PLANS, type Plan } from "@/lib/payments/plans";
import { getPaddle, previewPrice } from "@/lib/payments/paddle-client";
import { useEntitlement } from "@/lib/store/user-store";
import { cn } from "@/lib/utils";

/**
 * Pricing table. The Pro price is fetched from Paddle so visitors see the
 * amount in their own currency, tax included where Paddle applies it.
 * `countryCode` comes from the server (Vercel's geo header); when absent,
 * Paddle detects the country itself.
 */
export function PricingTable({ countryCode }: { countryCode?: string }) {
  const { payments, hasHydrated, plan } = useEntitlement();
  const [localPrice, setLocalPrice] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!hasHydrated || !payments.configured) return;
    let cancelled = false;
    (async () => {
      const paddle = await getPaddle(payments);
      if (!paddle) return;
      for (const p of PLANS) {
        if (!p.priceId) continue;
        try {
          const total = await previewPrice(paddle, p.priceId, countryCode);
          if (total && !cancelled) setLocalPrice((prev) => ({ ...prev, [p.id]: total }));
        } catch {
          // Keep the fallback label; Paddle formatting is optional for display.
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasHydrated, payments, countryCode]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {PLANS.map((p) => (
        <PlanCard key={p.id} plan={p} price={localPrice[p.id] ?? p.fallbackPrice} isCurrent={p.id === plan} />
      ))}
    </div>
  );
}

function PlanCard({ plan, price, isCurrent }: { plan: Plan; price: string; isCurrent: boolean }) {
  const href = plan.id === "pro" ? "/checkout?return=/dashboard" : "/builder/new";
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-8",
        plan.highlighted ? "border-brand shadow-[0_20px_60px_-24px_rgba(30,58,95,0.35)]" : "border-border",
      )}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">
          Most popular
        </span>
      )}
      <h2 className="text-lg font-semibold">{plan.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
      <p className="mt-6 flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-tight" data-testid={`price-${plan.id}`}>
          {price}
        </span>
        <span className="text-sm text-muted-foreground">{plan.id === "free" ? "forever" : "one-time payment"}</span>
      </p>
      <ul className="mt-8 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm">
            <span className={cn("flex size-5 items-center justify-center rounded-full", plan.highlighted ? "bg-brand text-white" : "bg-muted text-foreground")}>
              <CheckIcon className="size-3" />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-8 pt-2">
        {isCurrent && plan.id === "pro" ? (
          <ButtonLink variant="outline" className="h-11 w-full text-base" href="/dashboard">
            You have Pro · Go to my CVs
          </ButtonLink>
        ) : (
          <ButtonLink variant={plan.highlighted ? "default" : "outline"} className="h-11 w-full text-base" href={href}>
            {plan.cta}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
