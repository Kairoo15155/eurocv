import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * EuroCV wordmark with a ring of twelve dots — a quiet nod to the European
 * circle of stars, abstracted so it reads as a brand mark rather than a flag.
 */
export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  const dots = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const r = 9.5;
    return { cx: 14 + r * Math.cos(angle), cy: 14 + r * Math.sin(angle) };
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect width="28" height="28" rx="7" fill="currentColor" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="1.35" fill="#ffffff" />
      ))}
      <path d="M11.2 10.2h5.9M11.2 14h4.6M11.2 17.8h5.9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
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
