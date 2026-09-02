import type { Metadata } from "next";
import { ArrowRightIcon } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ExampleViewer } from "@/components/cv/example-viewer";

export const metadata: Metadata = {
  title: "Example CV",
  description:
    "See what a finished EuroCV looks like: a realistic example of a Georgian student's CV for a European bachelor's application.",
};

export default function ExamplePage() {
  return (
    <SiteShell>
      <section className="border-b border-border bg-canvas">
        <Container className="flex flex-col gap-6 py-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full bg-foreground px-3 py-1 text-xs font-medium text-white">Example CV</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">What a finished EuroCV looks like</h1>
            <p className="mt-3 text-muted-foreground">
              A fictional profile of a Tbilisi high school graduate applying for a Computer Science bachelor’s in the
              Netherlands. Every detail below is invented for illustration; no real person is described.
            </p>
          </div>
          <ButtonLink className="h-11 px-5" href="/builder/new">
            Build mine like this
            <ArrowRightIcon data-icon="inline-end" />
          </ButtonLink>
        </Container>
      </section>
      <Container className="py-10">
        <ExampleViewer />
      </Container>
    </SiteShell>
  );
}
