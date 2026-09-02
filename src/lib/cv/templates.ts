import type { TemplateId } from "./types";

export type SectionKey =
  | "summary"
  | "education"
  | "experience"
  | "projects"
  | "achievements"
  | "activities"
  | "skills"
  | "languages";

/**
 * Presentation config consumed by both the HTML preview and the PDF
 * renderer so the two always agree on order, labels and styling.
 */
export interface TemplateConfig {
  id: TemplateId;
  font: "serif" | "sans";
  headerAlign: "center" | "left";
  /** Hex colour used for headings/rules. Kept subtle for ATS-friendliness. */
  accent: string;
  headingStyle: "rule" | "caps-accent" | "bold-rule";
  datesPosition: "inline" | "right";
  sectionOrder: SectionKey[];
  labels: Record<SectionKey, string>;
}

const DEFAULT_LABELS: Record<SectionKey, string> = {
  summary: "Profile",
  education: "Education",
  experience: "Experience",
  projects: "Projects",
  achievements: "Achievements & Awards",
  activities: "Extracurricular Activities",
  skills: "Skills",
  languages: "Languages",
};

export const TEMPLATE_CONFIGS: Record<TemplateId, TemplateConfig> = {
  classic: {
    id: "classic",
    font: "serif",
    headerAlign: "center",
    accent: "#1a1a1a",
    headingStyle: "rule",
    datesPosition: "right",
    sectionOrder: [
      "summary",
      "education",
      "experience",
      "projects",
      "achievements",
      "activities",
      "skills",
      "languages",
    ],
    labels: DEFAULT_LABELS,
  },
  modern: {
    id: "modern",
    font: "sans",
    headerAlign: "left",
    accent: "#1e3a5f",
    headingStyle: "caps-accent",
    datesPosition: "right",
    sectionOrder: [
      "summary",
      "education",
      "projects",
      "experience",
      "achievements",
      "activities",
      "skills",
      "languages",
    ],
    labels: { ...DEFAULT_LABELS, summary: "Summary", activities: "Activities & Leadership" },
  },
  academic: {
    id: "academic",
    font: "serif",
    headerAlign: "left",
    accent: "#2b2b2b",
    headingStyle: "bold-rule",
    datesPosition: "inline",
    sectionOrder: [
      "summary",
      "education",
      "achievements",
      "languages",
      "projects",
      "experience",
      "activities",
      "skills",
    ],
    labels: {
      ...DEFAULT_LABELS,
      summary: "Academic Profile",
      achievements: "Honours, Awards & Certificates",
      languages: "Languages & Test Scores",
      projects: "Academic & Personal Projects",
      experience: "Work, Internships & Volunteering",
    },
  },
};
