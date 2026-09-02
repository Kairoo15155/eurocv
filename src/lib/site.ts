export const SITE = {
  name: "EuroCV",
  tagline: "Your European University CV, made simple.",
  title: "EuroCV — Build Your European University CV",
  description:
    "Create a professional CV for European university applications with AI. Built specifically for Georgian students.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://eurocv.app",
  supportEmail: "hello@eurocv.app",
} as const;

export const NAV_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
] as const;
