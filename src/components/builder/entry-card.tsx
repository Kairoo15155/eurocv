"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Container for one repeatable entry (an education record, a project…). */
export function EntryCard({
  title,
  index,
  onRemove,
  children,
  className,
}: {
  title: string;
  index: number;
  onRemove: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-canvas/60 p-4 sm:p-5", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">
          {title} {index + 1}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
          aria-label={`Remove ${title.toLowerCase()} ${index + 1}`}
        >
          <Trash2Icon data-icon="inline-start" />
          Remove
        </Button>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export function AddEntryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="outline" className="h-11 w-full border-dashed" onClick={onClick}>
      <PlusIcon data-icon="inline-start" />
      {label}
    </Button>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-canvas/50 p-8 text-center">
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      <div className="mt-5 flex justify-center">{action}</div>
    </div>
  );
}
