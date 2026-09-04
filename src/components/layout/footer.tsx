import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { SITE } from "@/lib/site";

const groups = [
  {
    title: "Product",
    links: [
      { href: "/builder/new", label: "Create my CV" },
      { href: "/example", label: "Example CV" },
      { href: "/templates", label: "Templates" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/dashboard", label: "My CVs" },
      { href: "/signin", label: "Sign in" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of use" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-canvas">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{SITE.tagline}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            EuroCV is an independent service and is not affiliated with any university or European Union institution.
            Admission is never guaranteed.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="text-sm font-semibold">{g.title}</h3>
            <ul className="mt-3 space-y-2">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} EuroCV. Made in Tbilisi for students going abroad.</p>
          <p>Questions? {SITE.supportEmail}</p>
        </Container>
      </div>
    </footer>
  );
}
