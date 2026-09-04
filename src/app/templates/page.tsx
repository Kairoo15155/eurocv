import type { Metadata } from "next";
import { ArrowRightIcon } from "lucide-react";
import { CVPaper } from "@/components/cv/cv-paper";
import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { EXAMPLE_DOCUMENT } from "@/lib/cv/example";
import { TEMPLATES } from "@/lib/cv/options";

export const metadata: Metadata = {
  title: "CV templates",
  description: "Three professional, ATS-friendly CV templates designed for European university applications: Classic, Modern and Academic.",
};

const details: Record<string, string[]> = {
  classic: ["Serif typography", "Centred header", "Experience before projects"],
  modern: ["Sans-serif typography", "Navy accent headings", "Projects before experience"],
  academic: ["Serif typography", "Education and honours first", "Languages and test scores near the top"],
};

export default function TemplatesPage() {
  return (
    <SiteShell>
      <section className="border-b border-border bg-canvas py-16">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Templates built for admissions, not recruiters</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Every template is single-column, plain-text friendly and prints correctly on A4. Switch between them at any time; your information never changes.
            </p>
          </div>
        </Container>
      </section>
      <section className="py-16">
        <Container className="space-y-20">
          {TEMPLATES.map((t, i) => (
            <div key={t.id} className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">{t.name}</h2>
                <p className="mt-3 text-lg text-muted-foreground">{t.description}</p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {details[t.id].map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm">
                      <span className="size-1.5 rounded-full bg-brand" />
                      {d}
                    </li>
                  ))}
                </ul>
                <ButtonLink className="mt-8 h-11 px-5" href="/builder/new">
                  Use {t.name}
                  <ArrowRightIcon data-icon="inline-end" />
                </ButtonLink>
              </div>
              <div className="min-w-0 rounded-xl border border-border bg-canvas p-4 sm:p-6">
                <div className="max-h-[620px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]">
                  <CVPaper document={EXAMPLE_DOCUMENT} templateId={t.id} />
                </div>
              </div>
            </div>
          ))}
        </Container>
      </section>
    </SiteShell>
  );
}
