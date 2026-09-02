import { SiteShell } from "@/components/layout/site-shell";
import { Benefits } from "@/components/landing/benefits";
import { CTA } from "@/components/landing/cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TemplatesPreview } from "@/components/landing/templates-preview";

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <Benefits />
      <HowItWorks />
      <TemplatesPreview />
      <CTA />
    </SiteShell>
  );
}
