import type { Metadata } from "next";
import { headers } from "next/headers";
import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";
import { PricingTable } from "@/components/pricing/pricing-table";

export const metadata: Metadata = {
  title: "Pricing",
  description: "EuroCV is free to build and preview. Download your PDF, unlock all templates and AI improvement for a one-time €4.99.",
};

const faqs = [
  {
    q: "Is it really a one-time payment?",
    a: "Yes. Pay once and keep Pro for every CV you create in this browser. No subscription, no renewals.",
  },
  {
    q: "Can I try before paying?",
    a: "Everything up to the PDF is free: fill in your information, generate with AI and preview the result with the Classic template.",
  },
  {
    q: "Does EuroCV guarantee admission?",
    a: "No. A good CV helps, but admissions decisions belong to universities. Always review AI-written content before you submit it.",
  },
  {
    q: "What about the motivation letter?",
    a: "A motivation-letter assistant is planned for Pro users. It will be included at no extra cost when it launches.",
  },
];

/**
 * Country comes from Vercel's geo header so Paddle can localise the price.
 * When the header is missing (local dev, other hosts) nothing is passed and
 * Paddle detects the visitor's country itself.
 */
export default async function PricingPage() {
  const headerList = await headers();
  const country = headerList.get("x-vercel-ip-country");
  const countryCode = country && /^[A-Z]{2}$/.test(country) ? country : undefined;
  return (
    <SiteShell>
      <section className="border-b border-border bg-canvas py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Simple pricing for students</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Build for free. Pay once when you’re ready to download. Less than the price of a coffee in Amsterdam.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl">
            <PricingTable countryCode={countryCode} />
          </div>
        </Container>
      </section>
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">Questions</h2>
            <dl className="mt-6 divide-y divide-border">
              {faqs.map((f) => (
                <div key={f.q} className="py-5">
                  <dt className="font-medium">{f.q}</dt>
                  <dd className="mt-1.5 text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
