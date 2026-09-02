"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckIcon, LockIcon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/lib/store/user-store";

/**
 * Placeholder checkout. No payment is taken; completing the form marks the
 * browser as Pro. Swap the `onSubmit` body for a Stripe Checkout session
 * (or another provider) when payments go live.
 */
export function CheckoutView({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const plan = useUserStore((s) => s.plan);
  const upgradeToPro = useUserStore((s) => s.upgradeToPro);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const safeReturn = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/dashboard";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO(payments): create a checkout session server-side and redirect.
    await new Promise((r) => setTimeout(r, 900));
    upgradeToPro();
    toast.success("You're on EuroCV Pro. Enjoy!");
    router.push(safeReturn);
  };

  if (plan === "pro") {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckIcon className="size-6" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold">You already have Pro</h1>
          <p className="mt-2 text-muted-foreground">PDF downloads, all templates and AI improvement are unlocked.</p>
          <ButtonLink className="mt-6 h-11 w-full" href={safeReturn}>
            Continue
          </ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="rounded-2xl border border-border bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-1 text-sm text-muted-foreground">One-time payment. No account required today.</p>

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <strong>Preview mode.</strong> Payments aren’t live yet, so no card will be charged. Completing this form
            unlocks Pro in this browser so you can try the full product.
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email for your receipt</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-1.5 opacity-60">
              <Label>Card details</Label>
              <div className="flex h-11 items-center gap-2 rounded-lg border border-dashed border-input px-3 text-sm text-muted-foreground">
                <LockIcon className="size-4" />
                Card form appears here once payments are connected
              </div>
            </div>
          </div>

          <Button type="submit" className="mt-6 h-12 w-full text-base" disabled={submitting}>
            {submitting ? "Processing…" : "Pay €4.99 and unlock Pro"}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheckIcon className="size-3.5" />
            Secure checkout · VAT included where applicable
          </p>
        </form>

        <aside className="h-fit rounded-2xl border border-border bg-canvas p-6">
          <h2 className="font-semibold">Order summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>EuroCV Pro (one-time)</span>
            <span className="font-medium">€4.99</span>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>€4.99</span>
            </div>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {["PDF download", "All templates", "AI CV improvement", "Multiple CV versions", "Future motivation-letter feature"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckIcon className="size-4 text-success" />
                {f}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Container>
  );
}
