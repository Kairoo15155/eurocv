"use client";

import { FieldGrid, MonthField, SelectField, TextAreaField, TextField } from "@/components/builder/fields";
import { AddEntryButton, EmptyState, EntryCard } from "@/components/builder/entry-card";
import { StepHeader } from "@/components/builder/step-header";
import { Button } from "@/components/ui/button";
import { emptyAchievement } from "@/lib/cv/defaults";
import { ACHIEVEMENT_TYPES } from "@/lib/cv/options";
import type { AchievementType } from "@/lib/cv/types";
import { updateItem, type StepProps } from "./types";

export function AchievementsStep({ data, update, errors }: StepProps) {
  const add = () => update((d) => ({ ...d, achievements: [...d.achievements, emptyAchievement()] }));
  const set = (id: string, patch: Partial<(typeof data.achievements)[number]>) =>
    update((d) => ({ ...d, achievements: updateItem(d.achievements, id, patch) }));

  return (
    <div>
      <StepHeader
        title="Achievements"
        description="Olympiads, competitions, awards, certificates, scholarships and academic honours. Include the placing or level even if it wasn't first place."
      />
      {data.achievements.length === 0 ? (
        <EmptyState
          title="No achievements yet"
          text="A regional olympiad participation, a school medal, a Coursera certificate — each one adds credibility."
          action={<Button onClick={add}>Add an achievement</Button>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {data.achievements.map((a, i) => (
            <EntryCard key={a.id} title="Achievement" index={i} onRemove={() => update((d) => ({ ...d, achievements: d.achievements.filter((x) => x.id !== a.id) }))}>
              <FieldGrid>
                <SelectField<AchievementType> label="Type" value={a.type} onChange={(v) => set(a.id, { type: v })} options={ACHIEVEMENT_TYPES} />
                <MonthField label="Date" optional value={a.date} onChange={(v) => set(a.id, { date: v })} />
              </FieldGrid>
              <TextField label="Title" value={a.title} onChange={(v) => set(a.id, { title: v })} error={errors[`achievements.${i}.title`]} placeholder="National Olympiad in Informatics — Silver medal" />
              <TextField label="Awarded by" optional value={a.issuer} onChange={(v) => set(a.id, { issuer: v })} placeholder="Ministry of Education of Georgia" />
              <TextAreaField label="Details" optional rows={2} value={a.description} onChange={(v) => set(a.id, { description: v })} placeholder="Placed 5th of 240 participants in the national final." />
            </EntryCard>
          ))}
          <AddEntryButton label="Add another achievement" onClick={add} />
        </div>
      )}
    </div>
  );
}
