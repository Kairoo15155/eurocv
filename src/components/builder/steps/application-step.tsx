"use client";

import { FieldGrid, SelectField, SelectOrCustomField, TextField } from "@/components/builder/fields";
import { StepHeader } from "@/components/builder/step-header";
import { DEGREE_LEVELS, TARGET_COUNTRIES } from "@/lib/cv/options";
import type { DegreeLevel } from "@/lib/cv/types";
import type { StepProps } from "./types";

export function ApplicationStep({ data, update, errors }: StepProps) {
  const a = data.application;
  const set = (patch: Partial<typeof a>) => update((d) => ({ ...d, application: { ...d.application, ...patch } }));

  return (
    <div>
      <StepHeader
        title="University application"
        description="Tell us what you're applying for so the AI can emphasise what matters most for that programme and country."
      />
      <div className="flex flex-col gap-4">
        <FieldGrid>
          <SelectField<DegreeLevel>
            label="What are you applying for?"
            value={a.level}
            onChange={(v) => set({ level: v })}
            options={DEGREE_LEVELS}
            error={errors["application.level"]}
          />
          <SelectOrCustomField
            label="Country"
            value={a.country}
            onChange={(v) => set({ country: v })}
            options={TARGET_COUNTRIES}
            placeholder="Choose a country"
            customPlaceholder="Country name"
            error={errors["application.country"]}
          />
        </FieldGrid>
        <FieldGrid>
          <TextField
            label="Field of study"
            value={a.fieldOfStudy}
            onChange={(v) => set({ fieldOfStudy: v })}
            error={errors["application.fieldOfStudy"]}
            placeholder="Computer Science, Economics, Architecture…"
          />
          <TextField
            label="University name"
            optional
            value={a.university}
            onChange={(v) => set({ university: v })}
            placeholder="University of Amsterdam"
          />
        </FieldGrid>
      </div>
    </div>
  );
}
