/**
 * Core CV data model.
 *
 * `CVData` is what the student types into the builder.
 * `CVDocument` is the render-ready document (either mapped deterministically
 * from `CVData` for the live preview, or produced by the AI after generation).
 * Keeping the two separate lets templates render both without caring where
 * the content came from.
 */

export type TemplateId = "classic" | "modern" | "academic";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "native";

export type DegreeLevel = "bachelor" | "master" | "phd";

export type ExperienceType = "work" | "internship" | "volunteering" | "freelance";

export type AchievementType =
  | "olympiad"
  | "competition"
  | "award"
  | "certificate"
  | "scholarship"
  | "academic";

export type ActivityType =
  | "sports"
  | "music"
  | "student-organization"
  | "club"
  | "leadership"
  | "volunteering"
  | "personal-project"
  | "other";

export type LanguageTest = "IELTS" | "TOEFL" | "Cambridge" | "Goethe" | "DELF/DALF" | "Other";

/** Dates are stored as "YYYY-MM" strings; empty string means not set. */
export type MonthString = string;

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedin: string;
  website: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  city: string;
  country: string;
  degree: string;
  fieldOfStudy: string;
  startDate: MonthString;
  endDate: MonthString;
  current: boolean;
  gpa: string;
  subjects: string;
  achievements: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  level: CEFRLevel;
}

export interface TestScoreEntry {
  id: string;
  test: LanguageTest;
  score: string;
  date: MonthString;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string;
  date: MonthString;
  link: string;
}

export interface ExperienceEntry {
  id: string;
  type: ExperienceType;
  organization: string;
  position: string;
  location: string;
  startDate: MonthString;
  endDate: MonthString;
  current: boolean;
  description: string;
}

export interface AchievementEntry {
  id: string;
  type: AchievementType;
  title: string;
  issuer: string;
  date: MonthString;
  description: string;
}

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  title: string;
  organization: string;
  role: string;
  startDate: MonthString;
  endDate: MonthString;
  description: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
}

export interface ApplicationInfo {
  level: DegreeLevel | "";
  country: string;
  fieldOfStudy: string;
  university: string;
}

export interface CVData {
  personal: PersonalInfo;
  education: EducationEntry[];
  languages: LanguageEntry[];
  testScores: TestScoreEntry[];
  projects: ProjectEntry[];
  experience: ExperienceEntry[];
  achievements: AchievementEntry[];
  activities: ActivityEntry[];
  skills: Skills;
  application: ApplicationInfo;
}

/* ------------------------------------------------------------------ */
/* Render-ready document                                               */
/* ------------------------------------------------------------------ */

export interface DocHeader {
  fullName: string;
  /** Short line under the name, e.g. "Bachelor's applicant · Computer Science". */
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface DocEducation {
  institution: string;
  location: string;
  degree: string;
  dates: string;
  gpa: string;
  details: string[];
}

export interface DocExperience {
  organization: string;
  position: string;
  location: string;
  dates: string;
  type: string;
  bullets: string[];
}

export interface DocProject {
  name: string;
  technologies: string;
  date: string;
  link: string;
  bullets: string[];
}

export interface DocAchievement {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface DocActivity {
  title: string;
  organization: string;
  dates: string;
  description: string;
}

export interface DocLanguage {
  language: string;
  level: string;
}

export interface CVDocument {
  header: DocHeader;
  summary: string;
  education: DocEducation[];
  experience: DocExperience[];
  projects: DocProject[];
  achievements: DocAchievement[];
  activities: DocActivity[];
  skills: Skills;
  languages: DocLanguage[];
  /** Standardised test results, e.g. "IELTS 7.5 (2025)". */
  certifications: string[];
}

/* ------------------------------------------------------------------ */
/* AI review                                                            */
/* ------------------------------------------------------------------ */

export interface ReviewSuggestion {
  title: string;
  detail: string;
  /** Which part of the CV the suggestion refers to, e.g. "projects". */
  section: string;
}

export interface CVReview {
  overall: string;
  strengths: string[];
  missing: string[];
  suggestions: ReviewSuggestion[];
}

/* ------------------------------------------------------------------ */
/* Persistence                                                          */
/* ------------------------------------------------------------------ */

export interface SavedCV {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  /** Last time the builder data (not template/document) changed. */
  dataUpdatedAt: string;
  templateId: TemplateId;
  data: CVData;
  /** Present once the AI has generated the CV. */
  document: CVDocument | null;
  /** Present once "Improve my CV" has run. */
  review: CVReview | null;
  /** Timestamp of the data snapshot the document was generated from. */
  generatedAt: string | null;
}
