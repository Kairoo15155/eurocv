import type {
  AchievementType,
  ActivityType,
  CEFRLevel,
  DegreeLevel,
  ExperienceType,
  LanguageTest,
  TemplateId,
} from "./types";

export const COMMON_LANGUAGES = [
  "Georgian",
  "English",
  "German",
  "French",
  "Spanish",
  "Italian",
  "Dutch",
  "Russian",
  "Turkish",
] as const;

export const CEFR_LEVELS: { value: CEFRLevel; label: string }[] = [
  { value: "A1", label: "A1 · Beginner" },
  { value: "A2", label: "A2 · Elementary" },
  { value: "B1", label: "B1 · Intermediate" },
  { value: "B2", label: "B2 · Upper intermediate" },
  { value: "C1", label: "C1 · Advanced" },
  { value: "C2", label: "C2 · Proficient" },
  { value: "native", label: "Native" },
];

export const LANGUAGE_TESTS: LanguageTest[] = [
  "IELTS",
  "TOEFL",
  "Cambridge",
  "Goethe",
  "DELF/DALF",
  "Other",
];

export const DEGREE_LEVELS: { value: DegreeLevel; label: string }[] = [
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "phd", label: "PhD" },
];

export const TARGET_COUNTRIES = [
  "Netherlands",
  "Germany",
  "Belgium",
  "Italy",
  "France",
  "Sweden",
  "Finland",
  "Denmark",
  "Austria",
  "Other European country",
] as const;

export const EDUCATION_TYPES = [
  "High school diploma",
  "International Baccalaureate",
  "Bachelor's degree",
  "Master's degree",
  "Exchange programme",
  "Preparatory / language year",
  "Other",
] as const;

export const EXPERIENCE_TYPES: { value: ExperienceType; label: string }[] = [
  { value: "work", label: "Work" },
  { value: "internship", label: "Internship" },
  { value: "volunteering", label: "Volunteering" },
  { value: "freelance", label: "Freelance" },
];

export const ACHIEVEMENT_TYPES: { value: AchievementType; label: string }[] = [
  { value: "olympiad", label: "Olympiad" },
  { value: "competition", label: "Competition" },
  { value: "award", label: "Award" },
  { value: "certificate", label: "Certificate" },
  { value: "scholarship", label: "Scholarship" },
  { value: "academic", label: "Academic achievement" },
];

export const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: "sports", label: "Sports" },
  { value: "music", label: "Music" },
  { value: "student-organization", label: "Student organisation" },
  { value: "club", label: "Club" },
  { value: "leadership", label: "Leadership" },
  { value: "volunteering", label: "Volunteering" },
  { value: "personal-project", label: "Personal project" },
  { value: "other", label: "Other" },
];

export const SKILL_SUGGESTIONS = {
  technical: [
    "Python",
    "JavaScript",
    "TypeScript",
    "C++",
    "Java",
    "React",
    "SQL",
    "Git",
    "MATLAB",
    "AutoCAD",
    "Figma",
    "Microsoft Office",
    "Excel",
    "Data analysis",
    "Statistics",
    "Adobe Photoshop",
  ],
  soft: [
    "Leadership",
    "Communication",
    "Teamwork",
    "Research",
    "Problem solving",
    "Public speaking",
    "Time management",
    "Critical thinking",
    "Adaptability",
    "Mentoring",
  ],
} as const;

export const PROJECT_EXAMPLES: { field: string; example: string }[] = [
  {
    field: "Computer Science",
    example:
      "Built a web app that helps students track exam schedules. Used React and Firebase; 120 classmates signed up in the first month.",
  },
  {
    field: "AI",
    example:
      "Trained an image classifier to recognise Georgian handwritten letters using PyTorch, reaching 94% accuracy on a self-collected dataset.",
  },
  {
    field: "Engineering",
    example:
      "Designed and 3D-printed a small wind turbine model for a physics fair, measuring output under different blade angles.",
  },
  {
    field: "Business",
    example:
      "Ran a school fundraising campaign that sold handmade goods, coordinated a team of 6 and raised 2,400 GEL for a local shelter.",
  },
  {
    field: "Arts",
    example:
      "Curated a photography exhibition of 30 works about Tbilisi's old town, shown at a community gallery for two weeks.",
  },
  {
    field: "Science",
    example:
      "Tested how water hardness affects plant growth over 8 weeks, presenting the results at the national student science conference.",
  },
];

export const TEMPLATES: {
  id: TemplateId;
  name: string;
  description: string;
  pro: boolean;
}[] = [
  {
    id: "classic",
    name: "Classic",
    description: "A simple, timeless academic CV. Serif typography, clear sections.",
    pro: false,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean sans-serif layout with subtle hierarchy and a compact header.",
    pro: true,
  },
  {
    id: "academic",
    name: "Academic",
    description: "Structured for university admissions, with education and achievements first.",
    pro: true,
  },
];

export const FREE_TEMPLATE: TemplateId = "classic";
