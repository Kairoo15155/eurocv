import type { CVData } from "./types";

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}([/?#].*)?$/i;

/**
 * Step-level validation. Only genuinely required fields are enforced;
 * everything else is optional so students are never blocked on
 * information they don't have.
 */
export function validateStep(step: number, data: CVData): FieldErrors {
  const errors: FieldErrors = {};
  switch (step) {
    case 0: {
      const p = data.personal;
      if (!p.firstName.trim()) errors["personal.firstName"] = "First name is required.";
      if (!p.lastName.trim()) errors["personal.lastName"] = "Last name is required.";
      if (!p.email.trim()) errors["personal.email"] = "Email is required so universities can reach you.";
      else if (!EMAIL_RE.test(p.email.trim())) errors["personal.email"] = "Enter a valid email address.";
      if (p.linkedin.trim() && !URL_RE.test(p.linkedin.trim()))
        errors["personal.linkedin"] = "Enter a valid LinkedIn URL.";
      if (p.website.trim() && !URL_RE.test(p.website.trim()))
        errors["personal.website"] = "Enter a valid website URL.";
      break;
    }
    case 1: {
      if (data.education.length === 0) {
        errors["education"] = "Add at least one school or university.";
      }
      data.education.forEach((e, i) => {
        if (!e.institution.trim()) errors[`education.${i}.institution`] = "School or university name is required.";
        if (!e.startDate) errors[`education.${i}.startDate`] = "Start date is required.";
        if (!e.current && !e.endDate) errors[`education.${i}.endDate`] = "Add an end date or tick “currently studying”.";
      });
      break;
    }
    case 2: {
      data.languages.forEach((l, i) => {
        if (!l.language.trim()) errors[`languages.${i}.language`] = "Choose a language.";
      });
      data.testScores.forEach((t, i) => {
        if (!t.score.trim()) errors[`testScores.${i}.score`] = "Enter your score or remove this test.";
      });
      break;
    }
    case 3: {
      data.projects.forEach((p, i) => {
        if (!p.name.trim()) errors[`projects.${i}.name`] = "Project name is required.";
        if (p.link.trim() && !URL_RE.test(p.link.trim())) errors[`projects.${i}.link`] = "Enter a valid link.";
      });
      break;
    }
    case 4: {
      data.experience.forEach((x, i) => {
        if (!x.organization.trim()) errors[`experience.${i}.organization`] = "Organisation is required.";
        if (!x.position.trim()) errors[`experience.${i}.position`] = "Position is required.";
      });
      break;
    }
    case 5: {
      data.achievements.forEach((a, i) => {
        if (!a.title.trim()) errors[`achievements.${i}.title`] = "Give this achievement a title.";
      });
      break;
    }
    case 6: {
      data.activities.forEach((a, i) => {
        if (!a.title.trim()) errors[`activities.${i}.title`] = "Give this activity a name.";
      });
      break;
    }
    case 8: {
      const a = data.application;
      if (!a.level) errors["application.level"] = "Choose what you are applying for.";
      if (!a.country) errors["application.country"] = "Choose a country.";
      if (!a.fieldOfStudy.trim()) errors["application.fieldOfStudy"] = "Tell us your intended field of study.";
      break;
    }
  }
  return errors;
}

export function validateAll(data: CVData): { step: number; errors: FieldErrors } | null {
  for (let step = 0; step < 9; step++) {
    const errors = validateStep(step, data);
    if (Object.keys(errors).length > 0) return { step, errors };
  }
  return null;
}
