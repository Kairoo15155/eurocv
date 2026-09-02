"use client";

import { FieldGrid, MonthField, SelectOrCustomField, TextAreaField, TextField } from "@/components/builder/fields";
import { AddEntryButton, EntryCard } from "@/components/builder/entry-card";
import { StepHeader } from "@/components/builder/step-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { emptyEducation } from "@/lib/cv/defaults";
import { EDUCATION_TYPES } from "@/lib/cv/options";
import { updateItem, type StepProps } from "./types";

export function EducationStep({ data, update, errors }: StepProps) {
  const add = () => update((d) => ({ ...d, education: [...d.education, emptyEducation()] }));
  const remove = (id: string) => update((d) => ({ ...d, education: d.education.filter((e) => e.id !== id) }));
  const set = (id: string, patch: Partial<(typeof data.education)[number]>) =>
    update((d) => ({ ...d, education: updateItem(d.education, id, patch) }));

  return (
    <div>
      <StepHeader
        title="Education"
        description="Your school and any university studies. Add your current school even if you haven't graduated yet."
      />
      {errors["education"] && <p className="mb-4 text-sm text-destructive">{errors["education"]}</p>}
      <div className="flex flex-col gap-4">
        {data.education.map((e, i) => (
          <EntryCard key={e.id} title="Education" index={i} onRemove={() => remove(e.id)}>
            <TextField
              label="School or university"
              value={e.institution}
              onChange={(v) => set(e.id, { institution: v })}
              error={errors[`education.${i}.institution`]}
              placeholder="Tbilisi Public School No. 51"
            />
            <FieldGrid>
              <TextField label="City" optional value={e.city} onChange={(v) => set(e.id, { city: v })} placeholder="Tbilisi" />
              <TextField label="Country" optional value={e.country} onChange={(v) => set(e.id, { country: v })} placeholder="Georgia" />
            </FieldGrid>
            <FieldGrid>
              <SelectOrCustomField
                label="Degree or type"
                optional
                value={e.degree}
                onChange={(v) => set(e.id, { degree: v })}
                options={EDUCATION_TYPES}
                placeholder="High school diploma, Bachelor's…"
              />
              <TextField
                label="Field of study or track"
                optional
                value={e.fieldOfStudy}
                onChange={(v) => set(e.id, { fieldOfStudy: v })}
                placeholder="Physics and Mathematics track"
              />
            </FieldGrid>
            <FieldGrid>
              <MonthField label="Start date" value={e.startDate} onChange={(v) => set(e.id, { startDate: v })} error={errors[`education.${i}.startDate`]} />
              <div className="flex flex-col gap-2">
                <MonthField
                  label="End date"
                  value={e.endDate}
                  onChange={(v) => set(e.id, { endDate: v })}
                  error={errors[`education.${i}.endDate`]}
                  disabled={e.current}
                  hint={e.current ? "Expected graduation can be left empty." : undefined}
                />
                <Label className="flex items-center gap-2 text-sm font-normal">
                  <Checkbox checked={e.current} onCheckedChange={(c) => set(e.id, { current: Boolean(c) })} />
                  I’m currently studying here
                </Label>
              </div>
            </FieldGrid>
            <FieldGrid>
              <TextField
                label="GPA or average grade"
                optional
                value={e.gpa}
                onChange={(v) => set(e.id, { gpa: v })}
                placeholder="9.6 / 10"
                hint="Use your school's scale; we'll show it as written."
              />
              <TextField
                label="Relevant subjects"
                optional
                value={e.subjects}
                onChange={(v) => set(e.id, { subjects: v })}
                placeholder="Mathematics, Physics, Informatics"
              />
            </FieldGrid>
            <TextAreaField
              label="Academic achievements"
              optional
              rows={3}
              value={e.achievements}
              onChange={(v) => set(e.id, { achievements: v })}
              placeholder={"Gold medal graduate\nNational exams: Mathematics 92/100, English 95/100"}
              hint="One per line. National exam scores, medals, top-of-class rankings all belong here."
            />
          </EntryCard>
        ))}
        <AddEntryButton label="Add another school or university" onClick={add} />
      </div>
    </div>
  );
}
