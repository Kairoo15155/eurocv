import type { CEFRLevel, MonthString } from "./types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2023-09" -> "Sep 2023". Returns "" for empty or malformed input. */
export function formatMonth(value: MonthString): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  const m = Number(month);
  if (!year || !m || m < 1 || m > 12) return year ?? "";
  return `${MONTHS[m - 1]} ${year}`;
}

export function formatDateRange(start: MonthString, end: MonthString, current: boolean): string {
  const s = formatMonth(start);
  const e = current ? "Present" : formatMonth(end);
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

export function formatCEFR(level: CEFRLevel): string {
  const labels: Record<CEFRLevel, string> = {
    A1: "A1 (Beginner)",
    A2: "A2 (Elementary)",
    B1: "B1 (Intermediate)",
    B2: "B2 (Upper intermediate)",
    C1: "C1 (Advanced)",
    C2: "C2 (Proficient)",
    native: "Native",
  };
  return labels[level] ?? level;
}

export function joinNonEmpty(parts: (string | undefined | null)[], separator = ", "): string {
  return parts.map((p) => (p ?? "").trim()).filter(Boolean).join(separator);
}

/** Splits free text into bullet points on newlines or sentence boundaries. */
export function toBullets(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const lines = trimmed
    .split(/\n+/)
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
  return lines;
}

export function cvFileName(firstName: string, lastName: string): string {
  const safe = (s: string) =>
    s
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "_");
  const base = [safe(firstName), safe(lastName)].filter(Boolean).join("_") || "My";
  return `${base}_EuroCV.pdf`;
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
