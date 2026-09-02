"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { CheckIcon, LockIcon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, confirmPurchase, devUnlockPro, restorePurchase } from "@/lib/api/client";
import { useEntitlement } from "@/lib/store/user-store";

const PRO_FEATURES = [
  "PDF download",
  "All templates",
  "AI CV improvement",
  "Multiple CV versions",
  "Future motivation-letter feature",
];

/**
 * Checkout. With Paddle configured, opens Paddle's hosted overlay checkout
 * and confirms the transaction server-side before unlocking Pro. Without
 * it, explains that payments aren't live yet and offers purchase restore.
 */
export function CheckoutView({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const { plan, payments, devUnlock, hasHydrated, refresh } = useEntitlement();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const paddleRef = useRef<Paddle | null>(null);
  const [paddleReady, setPaddleReady] = useState(false);

  const safeReturn = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/dashboard";

  const finishPurchase = async (transactionId: string) => {
    setBusy(true);
    try {
      // Paddle may report completion a moment before the transaction is
      // queryable; retry briefly before giving up.
      let lastError: unknown = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          await confirmPurchase(transactionId);
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          if (!(error instanceof ApiError) || error.status !== 409) break;
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
      if (lastError) throw lastError;
      paddleRef.current?.Checkout.close();
      await refresh();
      toast.success("You're on EuroCV Pro. Thank you!");
      router.push(safeReturn);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Payment received, but we couldn't unlock Pro automatically. Use “Restore purchase” below.",
      );
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!payments.configured || !payments.clientToken || paddleRef.current) return;
    let cancelled = false;
    initializePaddle({
      environment: payments.environment,
      token: payments.clientToken,
      eventCallback: (event) => {
        if (event.name !== "checkout.completed" || !event.data?.transaction_id) return;
        void finishPurchase(event.data.transaction_id);
      },
    })
      .then((paddle) => {
        if (cancelled || !paddle) return;
        paddleRef.current = paddle;
        setPaddleReady(true);
      })
      .catch(() => toast.error("We couldn't load the payment form. Please refresh and try again."));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- finishPurchase only depends on stable refs/router
  }, [payments.configured, payments.clientToken, payments.environment]);

  const openCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const paddle = paddleRef.current;
    if (!paddle || !payments.priceId) return;
    paddle.Checkout.open({
      items: [{ priceId: payments.priceId, quantity: 1 }],
      customer: email ? { email } : undefined,
      settings: { displayMode: "overlay", theme: "light", locale: "en", showAddTaxId: false },
    });
  };

  const unlockForDevelopment = async () => {
    setBusy(true);
    try {
      await devUnlockPro();
      await refresh();
      toast.success("Pro unlocked for local development.");
      router.push(safeReturn);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Not available.");
    } finally {
      setBusy(false);
    }
  };

  if (!hasHydrated) {
    return (
      <Container className="py-12">
        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-[420px] rounded-2xl" />
          <Skeleton className="h-[320px] rounded-2xl" />
        </div>
      </Container>
    );
  }

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
        <div className="space-y-6">
          <form onSubmit={openCheckout} className="rounded-2xl border border-border bg-white p-6 sm:p-8">
            <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
            <p className="mt-1 text-sm text-muted-foreground">One-time payment. No account required.</p>

            {payments.configured ? (
              <>
                <div className="mt-6 flex flex-col gap-1.5">
                  <Label htmlFor="email">Email for your receipt</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11"
                    autoComplete="email"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use an address you’ll remember: it’s how you restore Pro on another device.
                  </p>
                </div>
                {payments.environment === "sandbox" && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                    Test mode: payments use Paddle’s sandbox and no real money is charged.
                  </div>
                )}
                <Button type="submit" className="mt-6 h-12 w-full text-base" disabled={!paddleReady || busy}>
                  {busy ? "Confirming…" : paddleReady ? "Pay €4.99 and unlock Pro" : "Loading secure checkout…"}
                </Button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheckIcon className="size-3.5" />
                  Secure payment by Paddle · VAT included where applicable
                </p>
              </>
            ) : (
              <>
                <div className="mt-6 rounded-lg border border-border bg-canvas p-4 text-sm">
                  <div className="flex items-start gap-2">
                    <LockIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <p>
                      <strong>Payments are being set up.</strong> Pro isn’t available for purchase yet. Everything up to
                      the PDF stays free in the meantime.
                    </p>
                  </div>
                </div>
                {devUnlock && (
                  <Button type="button" variant="outline" className="mt-4 h-11 w-full" onClick={unlockForDevelopment} disabled={busy}>
                    Unlock Pro for local development
                  </Button>
                )}
              </>
            )}
          </form>

          <RestorePurchase disabled={!payments.configured} onRestored={async () => {
            await refresh();
            router.push(safeReturn);
          }} />
        </div>

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
            {PRO_FEATURES.map((f) => (
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

function RestorePurchase({ disabled, onRestored }: { disabled: boolean; onRestored: () => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await restorePurchase(email);
      toast.success("Welcome back. Pro is unlocked on this device.");
      await onRestored();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "We couldn't check your purchase right now.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-white p-6">
      <h2 className="font-semibold">Already bought Pro?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Enter the email you paid with to unlock Pro on this device.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-10"
          aria-label="Purchase email"
          disabled={disabled}
        />
        <Button type="submit" variant="outline" className="h-10 shrink-0" disabled={disabled || busy}>
          {busy ? "Checking…" : "Restore purchase"}
        </Button>
      </div>
    </form>
  );
}
