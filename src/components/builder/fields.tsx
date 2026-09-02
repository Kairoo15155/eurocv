"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface BaseProps {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
}

function FieldFrame({
  id,
  label,
  hint,
  error,
  optional,
  className,
  children,
}: BaseProps & { id: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  ...rest
}: BaseProps & {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  const id = useId();
  return (
    <FieldFrame id={id} {...rest}>
      <Input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={rest.error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 bg-white"
      />
    </FieldFrame>
  );
}

export function TextAreaField({
  value,
  onChange,
  placeholder,
  rows = 4,
  ...rest
}: BaseProps & { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  const id = useId();
  return (
    <FieldFrame id={id} {...rest}>
      <Textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={rest.error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[96px] resize-y bg-white"
      />
    </FieldFrame>
  );
}

export function SelectField<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select…",
  ...rest
}: BaseProps & {
  value: T | "";
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  placeholder?: string;
}) {
  const id = useId();
  return (
    <FieldFrame id={id} {...rest}>
      <Select value={value || null} onValueChange={(v) => v && onChange(v as T)} items={options}>
        <SelectTrigger id={id} className="h-10 w-full bg-white" aria-invalid={rest.error ? true : undefined}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldFrame>
  );
}

/** Combo of a select with common options plus a free-text "Other" input. */
export function SelectOrCustomField({
  value,
  onChange,
  options,
  placeholder,
  customPlaceholder = "Type your own",
  ...rest
}: BaseProps & {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  customPlaceholder?: string;
}) {
  const isKnown = value === "" || options.includes(value);
  const OTHER = "__other__";
  const id = useId();
  return (
    <FieldFrame id={id} {...rest}>
      <div className="flex flex-col gap-2">
        <Select
          value={value === "" ? null : isKnown ? value : OTHER}
          items={[...options.map((o) => ({ value: o, label: o })), { value: OTHER, label: "Other" }]}
          onValueChange={(v) => {
            if (v === OTHER) onChange(" ");
            else if (v) onChange(v);
          }}
        >
          <SelectTrigger id={id} className="h-10 w-full bg-white" aria-invalid={rest.error ? true : undefined}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
            <SelectItem value={OTHER}>Other</SelectItem>
          </SelectContent>
        </Select>
        {!isKnown && (
          <Input
            value={value.trim() === "" ? "" : value}
            placeholder={customPlaceholder}
            onChange={(e) => onChange(e.target.value || " ")}
            className="h-10 bg-white"
            autoFocus
          />
        )}
      </div>
    </FieldFrame>
  );
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Month + year picker storing "YYYY-MM". Works identically in every browser. */
export function MonthField({
  value,
  onChange,
  disabled,
  ...rest
}: BaseProps & { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const id = useId();
  const [year = "", month = ""] = value.split("-");
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => String(thisYear + 6 - i));

  const set = (y: string, m: string) => {
    if (!y && !m) return onChange("");
    onChange(`${y}-${m}`);
  };
  const monthItems = MONTHS.map((name, i) => ({ value: String(i + 1).padStart(2, "0"), label: name }));
  const yearItems = years.map((y) => ({ value: y, label: y }));

  return (
    <FieldFrame id={id} {...rest}>
      <div className={cn("grid grid-cols-[1fr_96px] gap-2", disabled && "opacity-50")}>
        <Select value={month || null} onValueChange={(m) => m && set(year, m)} disabled={disabled} items={monthItems}>
          <SelectTrigger id={id} className="h-10 w-full bg-white" aria-invalid={rest.error ? true : undefined}>
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((name, i) => {
              const v = String(i + 1).padStart(2, "0");
              return (
                <SelectItem key={v} value={v}>
                  {name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Select value={year || null} onValueChange={(y) => y && set(y, month)} disabled={disabled} items={yearItems}>
          <SelectTrigger className="h-10 w-full bg-white" aria-label="Year" aria-invalid={rest.error ? true : undefined}>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FieldFrame>
  );
}

export function FieldGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
}
