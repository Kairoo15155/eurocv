import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <SiteShell>
      <Container className="py-16">
        <article className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated {updated}</p>
          <div className="prose-eurocv mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/85 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
            {children}
          </div>
        </article>
      </Container>
    </SiteShell>
  );
}
