import { ArrowRightIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";

export function CTA() {
  return (
    <section className="py-20 lg:py-24">
      <Container>
        <div className="rounded-2xl bg-primary px-8 py-14 text-center text-primary-foreground sm:px-14">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Your application deserves a CV that reads like you already belong there.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/75">
            Start for free. Preview your CV instantly. Download the PDF when you’re happy with it.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink variant="secondary"
              className="h-12 bg-white px-6 text-base text-primary hover:bg-white/90" href="/builder/new">
              Create my CV
              <ArrowRightIcon data-icon="inline-end" />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
