"use client";

import { CheckIcon } from "lucide-react";
import { BUILDER_STEPS } from "./steps";
import { cn } from "@/lib/utils";

export function StepProgress({
  current,
  maxReached,
  onSelect,
}: {
  current: number;
  maxReached: number;
  onSelect: (index: number) => void;
}) {
  const percent = Math.round(((current + 1) / BUILDER_STEPS.length) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <p className="font-medium">
          Step {current + 1} of {BUILDER_STEPS.length}
          <span className="text-muted-foreground"> · {BUILDER_STEPS[current].label}</span>
        </p>
        <p className="text-muted-foreground">{percent}%</p>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out" style={{ width: `${percent}%` }} />
      </div>
      <ol className="mt-4 hidden flex-wrap gap-1.5 lg:flex">
        {BUILDER_STEPS.map((s, i) => {
          const done = i < current;
          const reachable = i <= maxReached;
          return (
            <li key={s.key}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onSelect(i)}
                aria-current={i === current ? "step" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  i === current
                    ? "border-brand bg-brand text-white"
                    : done
                      ? "border-border bg-white text-foreground hover:border-foreground/40"
                      : reachable
                        ? "border-border bg-white text-muted-foreground hover:text-foreground"
                        : "border-transparent text-muted-foreground/60",
                )}
              >
                {done && <CheckIcon className="size-3" />}
                {s.short}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
