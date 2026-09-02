import { CheckIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    description: "Everything you need to build and preview your CV.",
    features: ["Create CV", "Basic template", "AI generation", "Preview"],
    cta: { label: "Start for free", href: "/builder/new" },
    highlighted: false,
  },
  {
    name: "Pro",
    price: "€4.99",
    period: "one-time payment",
    description: "Download, polish and keep several versions of your CV.",
    features: [
      "PDF download",
      "All templates",
      "AI CV improvement",
      "Multiple CV versions",
      "Future motivation-letter feature",
    ],
    cta: { label: "Get Pro", href: "/checkout?return=/dashboard" },
    highlighted: true,
  },
];

export function PricingTable() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={cn(
            "relative flex flex-col rounded-2xl border bg-white p-8",
            plan.highlighted ? "border-brand shadow-[0_20px_60px_-24px_rgba(30,58,95,0.35)]" : "border-border",
          )}
        >
          {plan.highlighted && (
            <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">
              Most popular
            </span>
          )}
          <h2 className="text-lg font-semibold">{plan.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
          <p className="mt-6 flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
            <span className="text-sm text-muted-foreground">{plan.period}</span>
          </p>
          <ul className="mt-8 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <span className={cn("flex size-5 items-center justify-center rounded-full", plan.highlighted ? "bg-brand text-white" : "bg-muted text-foreground")}>
                  <CheckIcon className="size-3" />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-2">
            <ButtonLink variant={plan.highlighted ? "default" : "outline"}
              className="h-11 w-full text-base" href={plan.cta.href}>
              {plan.cta.label}
            </ButtonLink>
          </div>
        </div>
      ))}
    </div>
  );
}
