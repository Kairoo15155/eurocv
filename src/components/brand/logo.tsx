import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * EuroCV wordmark with a ring of twelve dots — a quiet nod to the European
 * circle of stars, abstracted so it reads as a brand mark rather than a flag.
 * The same geometry is exported as static files in `public/brand/` (SVG and
 * PNG, dark and white versions) and as the favicon / social image in `src/app/`.
 */
export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  const dots = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const r = 22.5;
    return { cx: 32 + r * Math.cos(angle), cy: 32 + r * Math.sin(angle) };
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect width="64" height="64" rx="16" fill="currentColor" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx.toFixed(2)} cy={d.cy.toFixed(2)} r="2.9" fill="#ffffff" />
      ))}
      <path d="M25.5 24.5h13M25.5 32h9.5M25.5 39.5h13" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5 text-brand", className)} aria-label="EuroCV home">
      <LogoMark />
      <span className="text-[19px] font-semibold tracking-tight text-foreground">
        Euro<span className="text-brand">CV</span>
      </span>
    </Link>
  );
}
