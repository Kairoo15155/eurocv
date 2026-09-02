"use client";

import { FieldGrid, MonthField, SelectField, TextAreaField, TextField } from "@/components/builder/fields";
import { AddEntryButton, EmptyState, EntryCard } from "@/components/builder/entry-card";
import { StepHeader } from "@/components/builder/step-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { emptyExperience } from "@/lib/cv/defaults";
import { EXPERIENCE_TYPES } from "@/lib/cv/options";
import type { ExperienceType } from "@/lib/cv/types";
import { updateItem, type StepProps } from "./types";

export function ExperienceStep({ data, update, errors }: StepProps) {
  const add = () => update((d) => ({ ...d, experience: [...d.experience, emptyExperience()] }));
  const set = (id: string, patch: Partial<(typeof data.experience)[number]>) =>
    update((d) => ({ ...d, experience: updateItem(d.experience, id, patch) }));

  return (
    <div>
      <StepHeader
        title="Experience"
        description="Work, internships, volunteering and freelance work. It's completely fine to skip this — most school applicants have little or none."
      />
      {data.experience.length === 0 ? (
        <EmptyState
          title="No experience added"
          text="Summer jobs, helping at a family business, tutoring, volunteering at an event: all of it counts."
          action={<Button onClick={add}>Add experience</Button>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {data.experience.map((x, i) => (
            <EntryCard key={x.id} title="Experience" index={i} onRemove={() => update((d) => ({ ...d, experience: d.experience.filter((e) => e.id !== x.id) }))}>
              <FieldGrid>
                <SelectField<ExperienceType> label="Type" value={x.type} onChange={(v) => set(x.id, { type: v })} options={EXPERIENCE_TYPES} />
                <TextField label="Organisation" value={x.organization} onChange={(v) => set(x.id, { organization: v })} error={errors[`experience.${i}.organization`]} placeholder="Girls in STEM Georgia" />
              </FieldGrid>
              <FieldGrid>
                <TextField label="Position" value={x.position} onChange={(v) => set(x.id, { position: v })} error={errors[`experience.${i}.position`]} placeholder="Workshop mentor" />
                <TextField label="Location" optional value={x.location} onChange={(v) => set(x.id, { location: v })} placeholder="Tbilisi, Georgia" />
              </FieldGrid>
              <FieldGrid>
                <MonthField label="Start date" optional value={x.startDate} onChange={(v) => set(x.id, { startDate: v })} />
                <div className="flex flex-col gap-2">
                  <MonthField label="End date" optional value={x.endDate} onChange={(v) => set(x.id, { endDate: v })} disabled={x.current} />
                  <Label className="flex items-center gap-2 text-sm font-normal">
                    <Checkbox checked={x.current} onCheckedChange={(c) => set(x.id, { current: Boolean(c) })} />
                    I still do this
                  </Label>
                </div>
              </FieldGrid>
              <TextAreaField
                label="Description"
                optional
                value={x.description}
                onChange={(v) => set(x.id, { description: v })}
                placeholder={"What did you do? One task or result per line.\nTaught weekend Python classes to 12 students\nCreated the lesson plan used by other mentors"}
              />
            </EntryCard>
          ))}
          <AddEntryButton label="Add another experience" onClick={add} />
        </div>
      )}
    </div>
  );
}
