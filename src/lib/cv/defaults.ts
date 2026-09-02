import type {
  AchievementEntry,
  ActivityEntry,
  CVData,
  EducationEntry,
  ExperienceEntry,
  LanguageEntry,
  ProjectEntry,
  SavedCV,
  TemplateId,
  TestScoreEntry,
} from "./types";

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyCVData(): CVData {
  return {
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      country: "Georgia",
      linkedin: "",
      website: "",
    },
    education: [emptyEducation()],
    languages: [
      { id: createId(), language: "Georgian", level: "native" },
      { id: createId(), language: "English", level: "B2" },
    ],
    testScores: [],
    projects: [],
    experience: [],
    achievements: [],
    activities: [],
    skills: { technical: [], soft: [] },
    application: { level: "bachelor", country: "", fieldOfStudy: "", university: "" },
  };
}

export function emptyEducation(): EducationEntry {
  return {
    id: createId(),
    institution: "",
    city: "",
    country: "Georgia",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    current: false,
    gpa: "",
    subjects: "",
    achievements: "",
  };
}

export function emptyLanguage(): LanguageEntry {
  return { id: createId(), language: "", level: "B1" };
}

export function emptyTestScore(): TestScoreEntry {
  return { id: createId(), test: "IELTS", score: "", date: "" };
}

export function emptyProject(): ProjectEntry {
  return { id: createId(), name: "", description: "", technologies: "", date: "", link: "" };
}

export function emptyExperience(): ExperienceEntry {
  return {
    id: createId(),
    type: "internship",
    organization: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

export function emptyAchievement(): AchievementEntry {
  return { id: createId(), type: "award", title: "", issuer: "", date: "", description: "" };
}

export function emptyActivity(): ActivityEntry {
  return {
    id: createId(),
    type: "club",
    title: "",
    organization: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

export function createSavedCV(partial?: Partial<SavedCV>): SavedCV {
  const now = new Date().toISOString();
  return {
    id: createId(),
    name: "Untitled CV",
    createdAt: now,
    updatedAt: now,
    dataUpdatedAt: now,
    templateId: "classic" satisfies TemplateId,
    data: emptyCVData(),
    document: null,
    review: null,
    generatedAt: null,
    ...partial,
  };
}
