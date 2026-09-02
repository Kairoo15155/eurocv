"use client";

import { CheckIcon, LockIcon } from "lucide-react";
import { TEMPLATES } from "@/lib/cv/options";
import type { TemplateId } from "@/lib/cv/types";
import { cn } from "@/lib/utils";

export function TemplatePicker({
  value,
  onChange,
  isPro = true,
  showLocks = true,
  layout = "list",
}: {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
  isPro?: boolean;
  showLocks?: boolean;
  layout?: "list" | "row";
}) {
  return (
    <div role="radiogroup" aria-label="CV template" className={cn(layout === "row" ? "flex gap-2" : "flex flex-col gap-2")}>
      {TEMPLATES.map((t) => {
        const selected = t.id === value;
        const locked = showLocks && t.pro && !isPro;
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
              selected ? "border-brand bg-brand-soft/60" : "border-border bg-white hover:border-foreground/30",
              layout === "row" && "flex-1 flex-col gap-1.5",
            )}
          >
            <TemplateThumb id={t.id} selected={selected} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t.name}</span>
                {locked ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    <LockIcon className="size-2.5" /> Pro
                  </span>
                ) : selected ? (
                  <CheckIcon className="size-3.5 text-brand" />
                ) : null}
              </div>
              {layout === "list" && <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{t.description}</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/** Tiny schematic of each layout so users can tell them apart at a glance. */
function TemplateThumb({ id, selected }: { id: TemplateId; selected: boolean }) {
  const line = cn("h-[3px] rounded-full", selected ? "bg-brand/70" : "bg-slate-300");
  return (
    <div className="flex h-14 w-11 shrink-0 flex-col gap-[3px] rounded-[3px] border border-slate-200 bg-white p-1.5">
      {id === "classic" && (
        <>
          <div className={cn(line, "mx-auto w-6")} />
          <div className={cn(line, "mx-auto w-4 opacity-60")} />
          <div className="mt-1 h-px bg-slate-300" />
          <div className={cn(line, "w-full opacity-50")} />
          <div className={cn(line, "w-5/6 opacity-50")} />
        </>
      )}
      {id === "modern" && (
        <>
          <div className={cn(line, "w-7 bg-brand")} />
          <div className={cn(line, "w-4 opacity-60")} />
          <div className="mt-1 h-[2px] bg-brand/70" />
          <div className={cn(line, "w-full opacity-50")} />
          <div className={cn(line, "w-4/6 opacity-50")} />
        </>
      )}
      {id === "academic" && (
        <>
          <div className={cn(line, "w-6")} />
          <div className="mt-0.5 h-px bg-slate-400" />
          <div className={cn(line, "w-3 font-bold")} />
          <div className={cn(line, "w-full opacity-50")} />
          <div className={cn(line, "w-3 mt-0.5")} />
          <div className={cn(line, "w-5/6 opacity-50")} />
        </>
      )}
    </div>
  );
}
