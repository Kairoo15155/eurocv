import { ArrowRightIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { CVPaper } from "@/components/cv/cv-paper";
import { ButtonLink } from "@/components/ui/button-link";
import { EXAMPLE_DOCUMENT } from "@/lib/cv/example";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.95_0.02_255)_0%,transparent_70%)]"
      />
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-24">
        <div className="max-w-xl">
          <p className="fade-up inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />
            Built for Georgian students applying to Europe
          </p>
          <h1 className="fade-up fade-up-delay-1 mt-6 text-[2.5rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            Build a CV that gets your European university application noticed.
          </h1>
          <p className="fade-up fade-up-delay-2 mt-6 text-lg leading-relaxed text-muted-foreground">
            Turn your grades, achievements, projects and experience into a professional European-style CV with AI.
          </p>
          <div className="fade-up fade-up-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink className="h-12 px-6 text-base" href="/builder/new">
              Create my CV
              <ArrowRightIcon data-icon="inline-end" />
            </ButtonLink>
            <ButtonLink variant="outline" className="h-12 px-6 text-base" href="/example">
              See an example
            </ButtonLink>
          </div>
          <p className="fade-up fade-up-delay-3 mt-5 text-sm text-muted-foreground">
            Free to start · No account needed · Download as PDF from €4.99
          </p>
        </div>

        <div className="fade-up fade-up-delay-2 relative mx-auto w-full min-w-0 max-w-[520px] lg:max-w-none">
          <div className="absolute -top-3 left-4 z-10 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-white shadow-sm">
            Example CV
          </div>
          <div className="max-h-[560px] overflow-hidden rounded-xl border border-border bg-canvas p-4 sm:p-6 [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]">
            <CVPaper document={EXAMPLE_DOCUMENT} templateId="modern" maxScale={0.72} />
          </div>
        </div>
      </Container>
    </section>
  );
}
