export const BUILDER_STEPS = [
  { key: "personal", label: "Personal", short: "Personal" },
  { key: "education", label: "Education", short: "Education" },
  { key: "languages", label: "Languages", short: "Languages" },
  { key: "projects", label: "Projects", short: "Projects" },
  { key: "experience", label: "Experience", short: "Experience" },
  { key: "achievements", label: "Achievements", short: "Awards" },
  { key: "activities", label: "Extracurricular", short: "Activities" },
  { key: "skills", label: "Skills", short: "Skills" },
  { key: "application", label: "Application", short: "Apply" },
] as const;

export type StepKey = (typeof BUILDER_STEPS)[number]["key"];
