"use client";

import { useEffect, useState } from "react";
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MESSAGES = [
  "Analyzing your experience",
  "Improving your descriptions",
  "Highlighting your achievements",
  "Preparing your European-style CV",
];

export function GeneratingScreen({
  error,
  onRetry,
  onCancel,
  title = "Creating your CV...",
}: {
  error: string | null;
  onRetry: () => void;
  onCancel: () => void;
  title?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (error) return;
    const t = setInterval(() => setIndex((i) => Math.min(i + 1, MESSAGES.length - 1)), 2600);
    return () => clearInterval(t);
  }, [error]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm" role="status" aria-live="polite">
      <div className="mx-5 w-full max-w-md text-center">
        {error ? (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircleIcon className="size-7" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight">Something went wrong</h2>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
              <Button className="h-11 px-5" onClick={onRetry}>
                <RefreshCwIcon data-icon="inline-start" />
                Try again
              </Button>
              <Button variant="outline" className="h-11 px-5" onClick={onCancel}>
                Back to the form
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="relative mx-auto size-16">
              <span className="absolute inset-0 animate-ping rounded-2xl bg-brand/15" />
              <div className="relative flex size-16 items-center justify-center rounded-2xl bg-white text-brand shadow-sm ring-1 ring-black/5">
                <LogoMark size={36} />
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-semibold tracking-tight">{title}</h2>
            <div className="relative mt-3 h-6 overflow-hidden">
              {MESSAGES.map((m, i) => (
                <p
                  key={m}
                  aria-hidden={i !== index}
                  className={cn(
                    "absolute inset-x-0 text-muted-foreground transition-all duration-500",
                    i === index ? "translate-y-0 opacity-100" : i < index ? "-translate-y-4 opacity-0" : "translate-y-4 opacity-0",
                  )}
                >
                  {m}…
                </p>
              ))}
            </div>
            <div className="mx-auto mt-8 flex w-48 gap-1.5">
              {MESSAGES.map((m, i) => (
                <span key={m} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= index ? "bg-brand" : "bg-muted")} />
              ))}
            </div>
            <p className="mt-8 text-xs text-muted-foreground">This usually takes 20–40 seconds.</p>
          </>
        )}
      </div>
    </div>
  );
}
