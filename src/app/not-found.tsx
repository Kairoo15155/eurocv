import { SiteShell } from "@/components/layout/site-shell";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="font-serif text-6xl text-brand/60">404</p>
        <h1 className="text-2xl font-semibold">This page doesn’t exist</h1>
        <p className="max-w-sm text-muted-foreground">The link may be old, or the page may have moved.</p>
        <ButtonLink href="/">Back to EuroCV</ButtonLink>
      </div>
    </SiteShell>
  );
}
