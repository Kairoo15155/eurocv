import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";
import { authEnabled, getSession, googleAuthEnabled } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default async function SignInPage(props: PageProps<"/signin">) {
  const search = await props.searchParams;
  const rawNext = Array.isArray(search.next) ? search.next[0] : search.next;
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";
  const authError = search.error === "oauth" || search.error === "link";

  if (authEnabled()) {
    const { user } = await getSession();
    if (user) redirect(next);
  }

  return (
    <SiteShell>
      <Container className="py-16">
        <div className="mx-auto max-w-sm rounded-2xl border border-border bg-white p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Keep your CVs on every device.</p>

          {authError && (
            <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {search.error === "link"
                ? "That sign-in link has expired or was already used. Request a new one below."
                : "Google sign-in didn’t complete. Please try again or use your email."}
            </p>
          )}

          <div className="mt-6">
            {authEnabled() ? (
              <SignInForm next={next} googleEnabled={googleAuthEnabled()} />
            ) : (
              <div className="rounded-lg border border-border bg-canvas p-3 text-xs text-muted-foreground">
                Sign-in isn’t available yet. You can build, generate and preview your CV without an account.
              </div>
            )}
          </div>

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
