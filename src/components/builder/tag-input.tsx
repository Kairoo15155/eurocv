"use client";

import { useId, useState } from "react";
import { XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function TagInput({
  label,
  hint,
  value,
  onChange,
  suggestions = [],
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (v: string[]) => void;
  suggestions?: readonly string[];
  placeholder?: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const items = raw
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!items.length) return;
    const existing = new Set(value.map((v) => v.toLowerCase()));
    const next = [...value];
    for (const item of items) {
      if (!existing.has(item.toLowerCase())) {
        next.push(item);
        existing.add(item.toLowerCase());
      }
    }
    onChange(next);
    setDraft("");
  };

  const remove = (item: string) => onChange(value.filter((v) => v !== item));
  const available = suggestions.filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()));

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-white px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        {value.map((item) => (
          <span key={item} className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-2 py-1 text-sm text-brand">
            {item}
            <button type="button" onClick={() => remove(item)} aria-label={`Remove ${item}`} className="rounded p-0.5 hover:bg-brand/10">
              <XIcon className="size-3" />
            </button>
          </span>
        ))}
        <Input
          id={id}
          value={draft}
          placeholder={value.length ? "Add more…" : placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              remove(value[value.length - 1]);
            }
          }}
          onBlur={() => draft.trim() && add(draft)}
          className="h-7 min-w-[140px] flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {available.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {available.slice(0, 12).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className={cn("rounded-full border border-border bg-white px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-brand hover:text-brand")}
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
