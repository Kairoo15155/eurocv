"use client";

import { useState } from "react";
import { AlertCircleIcon, CheckCircle2Icon, CircleDashedIcon, LightbulbIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { CVReview, ReviewSuggestion } from "@/lib/cv/types";

export function ImprovePanel({
  review,
  loading,
  applying,
  error,
  onRun,
  onApply,
}: {
  review: CVReview | null;
  loading: boolean;
  applying: boolean;
  error: string | null;
  onRun: () => void;
  onApply: (suggestions: ReviewSuggestion[]) => void;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  if (loading) {
    return (
      <div className="space-y-4 rounded-xl border border-border bg-white p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SparklesIcon className="size-4 animate-pulse text-brand" />
          Reviewing your CV…
        </div>
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="flex items-start gap-3">
          <AlertCircleIcon className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium">We couldn’t review your CV</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            <Button className="mt-4" size="sm" onClick={onRun}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <SparklesIcon className="size-4" />
        </div>
        <h3 className="mt-3 font-semibold">Improve my CV</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get an honest review: what’s strong, what’s missing, and specific changes that would help your application.
        </p>
        <Button className="mt-4 h-10 w-full" onClick={onRun}>
          <SparklesIcon data-icon="inline-start" />
          Review my CV
        </Button>
      </div>
    );
  }

  const toggle = (i: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const chosen = review.suggestions.filter((_, i) => selected.has(i));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-white p-5">
        <p className="text-sm leading-relaxed">{review.overall}</p>
      </div>

      <ReviewList icon={<CheckCircle2Icon className="size-4 text-success" />} title="Strengths" items={review.strengths} />
      <ReviewList icon={<CircleDashedIcon className="size-4 text-amber-600" />} title="Missing information" items={review.missing} />

      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex items-center gap-2">
          <LightbulbIcon className="size-4 text-brand" />
          <h3 className="font-semibold">Suggestions</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Select the suggestions you’d like the AI to apply. It will only rewrite wording; anything that needs new information is yours to add.
        </p>
        <ul className="mt-4 space-y-3">
          {review.suggestions.map((s, i) => (
            <li key={i}>
              <Label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 font-normal transition-colors has-data-checked:border-brand has-data-checked:bg-brand-soft/40">
                <Checkbox checked={selected.has(i)} onCheckedChange={() => toggle(i)} className="mt-0.5" />
                <span>
                  <span className="block text-sm font-medium">{s.title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">{s.detail}</span>
                  <span className="mt-1.5 inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase">
                    {s.section}
                  </span>
                </span>
              </Label>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-2">
          <Button className="h-10 w-full" disabled={chosen.length === 0 || applying} onClick={() => onApply(chosen)}>
            {applying ? "Applying…" : `Apply ${chosen.length > 0 ? `${chosen.length} ` : ""}improvement${chosen.length === 1 ? "" : "s"}`}
          </Button>
          <Button variant="ghost" size="sm" className="w-full" onClick={onRun} disabled={applying}>
            Run the review again
          </Button>
        </div>
      </div>
    </div>
  );
}

function ReviewList({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
