import { z } from "zod";

/**
 * Zod schemas shared by the API routes (request validation) and the AI
 * layer (structured output format). All document fields are required and
 * default to empty strings/arrays so the model never has to decide whether
 * to omit a key.
 */

const monthString = z.string().max(7);

export const personalSchema = z.object({
  firstName: z.string().max(80),
  lastName: z.string().max(80),
  email: z.string().max(160),
  phone: z.string().max(40),
  city: z.string().max(80),
  country: z.string().max(80),
  linkedin: z.string().max(200),
  website: z.string().max(200),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().max(160),
  city: z.string().max(80),
  country: z.string().max(80),
  degree: z.string().max(120),
  fieldOfStudy: z.string().max(120),
  startDate: monthString,
  endDate: monthString,
  current: z.boolean(),
  gpa: z.string().max(40),
  subjects: z.string().max(600),
  achievements: z.string().max(1500),
});

export const languageSchema = z.object({
  id: z.string(),
  language: z.string().max(60),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2", "native"]),
});

export const testScoreSchema = z.object({
  id: z.string(),
  test: z.enum(["IELTS", "TOEFL", "Cambridge", "Goethe", "DELF/DALF", "Other"]),
  score: z.string().max(40),
  date: monthString,
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().max(140),
  description: z.string().max(2000),
  technologies: z.string().max(300),
  date: monthString,
  link: z.string().max(300),
});

export const experienceSchema = z.object({
  id: z.string(),
  type: z.enum(["work", "internship", "volunteering", "freelance"]),
  organization: z.string().max(160),
  position: z.string().max(120),
  location: z.string().max(120),
  startDate: monthString,
  endDate: monthString,
  current: z.boolean(),
  description: z.string().max(2000),
});

export const achievementSchema = z.object({
  id: z.string(),
  type: z.enum(["olympiad", "competition", "award", "certificate", "scholarship", "academic"]),
  title: z.string().max(160),
  issuer: z.string().max(160),
  date: monthString,
  description: z.string().max(1000),
});

export const activitySchema = z.object({
  id: z.string(),
  type: z.enum([
    "sports",
    "music",
    "student-organization",
    "club",
    "leadership",
    "volunteering",
    "personal-project",
    "other",
  ]),
  title: z.string().max(160),
  organization: z.string().max(160),
  role: z.string().max(120),
  startDate: monthString,
  endDate: monthString,
  description: z.string().max(1000),
});

export const cvDataSchema = z.object({
  personal: personalSchema,
  education: z.array(educationSchema).max(10),
  languages: z.array(languageSchema).max(12),
  testScores: z.array(testScoreSchema).max(8),
  projects: z.array(projectSchema).max(15),
  experience: z.array(experienceSchema).max(15),
  achievements: z.array(achievementSchema).max(25),
  activities: z.array(activitySchema).max(20),
  skills: z.object({
    technical: z.array(z.string().max(60)).max(40),
    soft: z.array(z.string().max(60)).max(40),
  }),
  application: z.object({
    level: z.enum(["bachelor", "master", "phd", ""]),
    country: z.string().max(80),
    fieldOfStudy: z.string().max(120),
    university: z.string().max(160),
  }),
});

/* --------------------------- Document ------------------------------ */

export const docHeaderSchema = z.object({
  fullName: z.string(),
  headline: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  linkedin: z.string(),
  website: z.string(),
});

export const cvDocumentSchema = z.object({
  header: docHeaderSchema,
  summary: z.string(),
  education: z.array(
    z.object({
      institution: z.string(),
      location: z.string(),
      degree: z.string(),
      dates: z.string(),
      gpa: z.string(),
      details: z.array(z.string()),
    }),
  ),
  experience: z.array(
    z.object({
      organization: z.string(),
      position: z.string(),
      location: z.string(),
      dates: z.string(),
      type: z.string(),
      bullets: z.array(z.string()),
    }),
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      technologies: z.string(),
      date: z.string(),
      link: z.string(),
      bullets: z.array(z.string()),
    }),
  ),
  achievements: z.array(
    z.object({
      title: z.string(),
      issuer: z.string(),
      date: z.string(),
      description: z.string(),
    }),
  ),
  activities: z.array(
    z.object({
      title: z.string(),
      organization: z.string(),
      dates: z.string(),
      description: z.string(),
    }),
  ),
  skills: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()),
  }),
  languages: z.array(z.object({ language: z.string(), level: z.string() })),
  certifications: z.array(z.string()),
});

export const cvReviewSchema = z.object({
  overall: z.string(),
  strengths: z.array(z.string()),
  missing: z.array(z.string()),
  suggestions: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
      section: z.string(),
    }),
  ),
});

export const templateIdSchema = z.enum(["classic", "modern", "academic"]);
