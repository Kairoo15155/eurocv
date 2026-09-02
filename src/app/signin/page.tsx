import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

/**
 * Placeholder sign-in. Accounts are not part of the MVP; this page keeps the
 * route and layout ready for Google and email login.
 */
export default function SignInPage() {
  return (
    <SiteShell>
      <Container className="py-16">
        <div className="mx-auto max-w-sm rounded-2xl border border-border bg-white p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Accounts are coming soon. For now, your CVs are saved in this browser.</p>

          <div className="mt-6 rounded-lg border border-border bg-canvas p-3 text-xs text-muted-foreground">
            Sign-in isn’t available yet. You can build, generate and preview your CV without an account.
          </div>

          <form className="mt-6 flex flex-col gap-4">
            <Button type="button" variant="outline" className="h-11 w-full" disabled>
              <GoogleMark />
              Continue with Google
            </Button>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="h-11" disabled />
            </div>
            <Button type="button" className="h-11 w-full" disabled>
              Send magic link
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/builder/new" className="font-medium text-foreground underline underline-offset-4">
              Continue without an account
            </Link>
          </p>
        </div>
      </Container>
    </SiteShell>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.2v3.1C3.2 21.3 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.2C.4 8.2 0 10 0 12s.4 3.8 1.2 5.4l4.1-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.6l4.1 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  );
}
