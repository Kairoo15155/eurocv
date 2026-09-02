import { ACHIEVEMENT_TYPES, ACTIVITY_TYPES, DEGREE_LEVELS, EXPERIENCE_TYPES } from "./options";
import { formatCEFR, formatDateRange, formatMonth, joinNonEmpty, toBullets } from "./format";
import type { CVData, CVDocument, DocHeader } from "./types";

/**
 * Deterministic mapping from builder data to a render-ready document.
 * Used for the live preview before AI generation and as the structured
 * input the AI polishes. No content is invented here: every field is a
 * straight copy or formatting of what the student entered.
 */
export function toDocument(data: CVData): CVDocument {
  return {
    header: buildHeader(data),
    summary: "",
    education: data.education
      .filter((e) => e.institution.trim())
      .map((e) => ({
        institution: e.institution.trim(),
        location: joinNonEmpty([e.city, e.country]),
        degree: joinNonEmpty([e.degree, e.fieldOfStudy], " in "),
        dates: formatDateRange(e.startDate, e.endDate, e.current),
        gpa: e.gpa.trim(),
        details: [
          ...(e.subjects.trim() ? [`Relevant subjects: ${e.subjects.trim()}`] : []),
          ...toBullets(e.achievements),
        ],
      })),
    experience: data.experience
      .filter((x) => x.organization.trim() || x.position.trim())
      .map((x) => ({
        organization: x.organization.trim(),
        position: x.position.trim(),
        location: x.location.trim(),
        dates: formatDateRange(x.startDate, x.endDate, x.current),
        type: EXPERIENCE_TYPES.find((t) => t.value === x.type)?.label ?? "",
        bullets: toBullets(x.description),
      })),
    projects: data.projects
      .filter((p) => p.name.trim())
      .map((p) => ({
        name: p.name.trim(),
        technologies: p.technologies.trim(),
        date: formatMonth(p.date),
        link: p.link.trim(),
        bullets: toBullets(p.description),
      })),
    achievements: data.achievements
      .filter((a) => a.title.trim())
      .map((a) => ({
        title: a.title.trim(),
        issuer: joinNonEmpty(
          [ACHIEVEMENT_TYPES.find((t) => t.value === a.type)?.label, a.issuer],
          " · ",
        ),
        date: formatMonth(a.date),
        description: a.description.trim(),
      })),
    activities: data.activities
      .filter((a) => a.title.trim())
      .map((a) => ({
        title: joinNonEmpty([a.title, a.role], " — "),
        organization: joinNonEmpty(
          [a.organization, ACTIVITY_TYPES.find((t) => t.value === a.type)?.label],
          " · ",
        ),
        dates: formatDateRange(a.startDate, a.endDate, false),
        description: a.description.trim(),
      })),
    skills: {
      technical: data.skills.technical.map((s) => s.trim()).filter(Boolean),
      soft: data.skills.soft.map((s) => s.trim()).filter(Boolean),
    },
    languages: data.languages
      .filter((l) => l.language.trim())
      .map((l) => ({ language: l.language.trim(), level: formatCEFR(l.level) })),
    certifications: data.testScores
      .filter((t) => t.score.trim())
      .map((t) => {
        const year = t.date ? ` (${formatMonth(t.date)})` : "";
        return `${t.test} ${t.score.trim()}${year}`;
      }),
  };
}

export function buildHeader(data: CVData): DocHeader {
  const { personal, application } = data;
  const level = DEGREE_LEVELS.find((d) => d.value === application.level)?.label;
  const headline = joinNonEmpty(
    [level ? `${level} applicant` : "", application.fieldOfStudy],
    " · ",
  );
  return {
    fullName: joinNonEmpty([personal.firstName, personal.lastName], " "),
    headline,
    email: personal.email.trim(),
    phone: personal.phone.trim(),
    location: joinNonEmpty([personal.city, personal.country]),
    linkedin: personal.linkedin.trim(),
    website: personal.website.trim(),
  };
}

export function documentIsEmpty(doc: CVDocument): boolean {
  return (
    !doc.header.fullName &&
    doc.education.length === 0 &&
    doc.experience.length === 0 &&
    doc.projects.length === 0
  );
}
