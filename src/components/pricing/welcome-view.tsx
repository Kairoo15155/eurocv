"use client";

import { CheckIcon, SparklesIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Skeleton } from "@/components/ui/skeleton";
import { PRO_PLAN } from "@/lib/payments/plans";
import { useEntitlement } from "@/lib/store/user-store";

/** Landing page after a successful purchase (or restore). */
export function WelcomeView({ returnTo }: { returnTo: string }) {
  const { plan, email, hasHydrated } = useEntitlement();
  const safeReturn = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/dashboard";

  if (!hasHydrated) {
    return (
      <Container className="py-16">
        <Skeleton className="mx-auto h-[360px] max-w-md rounded-2xl" />
      </Container>
    );
  }

  if (plan !== "pro") {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold">Almost there</h1>
          <p className="mt-2 text-muted-foreground">
            We couldn’t find Pro on this browser yet. If you just paid, use “Restore purchase” with the email from your
            receipt and it will unlock right away.
          </p>
          <ButtonLink className="mt-6 h-11 w-full" href={`/checkout?return=${encodeURIComponent(safeReturn)}`}>
            Restore purchase
          </ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckIcon className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Welcome to EuroCV Pro</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you{email ? `, ${email}` : ""}. Your receipt is on its way from Paddle, our payment partner.
        </p>
        <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm">
          {PRO_PLAN.features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <SparklesIcon className="size-4 text-brand" />
              {f}
            </li>
          ))}
        </ul>
        <ButtonLink className="mt-8 h-11 w-full text-base" href={safeReturn}>
          Continue to my CV
        </ButtonLink>
        <p className="mt-4 text-xs text-muted-foreground">
          On another device, open Checkout and use “Restore purchase” with the same email.
        </p>
      </div>
    </Container>
  );
}
