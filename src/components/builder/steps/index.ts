import type { ComponentType } from "react";
import { AchievementsStep } from "./achievements-step";
import { ActivitiesStep } from "./activities-step";
import { ApplicationStep } from "./application-step";
import { EducationStep } from "./education-step";
import { ExperienceStep } from "./experience-step";
import { LanguagesStep } from "./languages-step";
import { PersonalStep } from "./personal-step";
import { ProjectsStep } from "./projects-step";
import { SkillsStep } from "./skills-step";
import type { StepProps } from "./types";

export const STEP_COMPONENTS: ComponentType<StepProps>[] = [
  PersonalStep,
  EducationStep,
  LanguagesStep,
  ProjectsStep,
  ExperienceStep,
  AchievementsStep,
  ActivitiesStep,
  SkillsStep,
  ApplicationStep,
];
