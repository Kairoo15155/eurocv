import Link from "next/link";
import { Container } from "@/components/layout/container";
import { CVPaper } from "@/components/cv/cv-paper";
import { ButtonLink } from "@/components/ui/button-link";
import { EXAMPLE_DOCUMENT } from "@/lib/cv/example";
import { TEMPLATES } from "@/lib/cv/options";

export function TemplatesPreview() {
  return (
    <section className="border-t border-border bg-canvas py-20">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold tracking-wide text-brand uppercase">Templates</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Three layouts. All of them serious.</h2>
            <p className="mt-4 text-muted-foreground">
              No skill bars, no icons, no colour explosions. Just clean, readable documents that pass automated screening and look right on an admissions officer’s desk.
            </p>
          </div>
          <ButtonLink variant="outline" className="h-10 px-4" href="/templates">
            Compare templates
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TEMPLATES.map((t) => (
            <Link key={t.id} href="/templates" className="group block">
              <div className="overflow-hidden rounded-xl border border-border bg-white p-3 transition-shadow group-hover:shadow-[0_12px_40px_-16px_rgba(15,23,42,0.3)]">
                <div className="max-h-[300px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
                  <CVPaper document={EXAMPLE_DOCUMENT} templateId={t.id} shadow={false} />
                </div>
              </div>
              <div className="mt-3 px-1">
                <p className="font-medium">{t.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
