"use client";

import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PRO_FEATURES = [
  "PDF download",
  "All three templates",
  "AI CV improvement",
  "Multiple CV versions",
  "Future motivation-letter feature",
];

export function UpgradeDialog({
  open,
  onOpenChange,
  returnTo,
  reason,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnTo: string;
  reason?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Unlock EuroCV Pro</DialogTitle>
          <DialogDescription>{reason ?? "This feature is part of EuroCV Pro."}</DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-border bg-canvas p-4">
          <p className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold tracking-tight">€4.99</span>
            <span className="text-sm text-muted-foreground">one-time · no subscription</span>
          </p>
          <ul className="mt-4 space-y-2">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <CheckIcon className="size-4 text-success" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" className="h-10" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          <ButtonLink className="h-10 px-5" href={`/checkout?return=${encodeURIComponent(returnTo)}`}>
            Get Pro for €4.99
          </ButtonLink>
        </div>
      </DialogContent>
    </Dialog>
  );
}
