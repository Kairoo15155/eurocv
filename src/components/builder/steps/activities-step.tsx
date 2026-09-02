"use client";

import { FieldGrid, MonthField, SelectField, TextAreaField, TextField } from "@/components/builder/fields";
import { AddEntryButton, EmptyState, EntryCard } from "@/components/builder/entry-card";
import { StepHeader } from "@/components/builder/step-header";
import { Button } from "@/components/ui/button";
import { emptyActivity } from "@/lib/cv/defaults";
import { ACTIVITY_TYPES } from "@/lib/cv/options";
import type { ActivityType } from "@/lib/cv/types";
import { updateItem, type StepProps } from "./types";

export function ActivitiesStep({ data, update, errors }: StepProps) {
  const add = () => update((d) => ({ ...d, activities: [...d.activities, emptyActivity()] }));
  const set = (id: string, patch: Partial<(typeof data.activities)[number]>) =>
    update((d) => ({ ...d, activities: updateItem(d.activities, id, patch) }));

  return (
    <div>
      <StepHeader
        title="Extracurricular activities"
        description="Sports, music, student organisations, clubs, leadership roles, volunteering and personal projects. European universities read these as evidence of character and commitment."
      />
      {data.activities.length === 0 ? (
        <EmptyState
          title="No activities yet"
          text="Debate club, football team, a YouTube channel about chemistry — anything you've stuck with over time."
          action={<Button onClick={add}>Add an activity</Button>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {data.activities.map((a, i) => (
            <EntryCard key={a.id} title="Activity" index={i} onRemove={() => update((d) => ({ ...d, activities: d.activities.filter((x) => x.id !== a.id) }))}>
              <FieldGrid>
                <SelectField<ActivityType> label="Type" value={a.type} onChange={(v) => set(a.id, { type: v })} options={ACTIVITY_TYPES} />
                <TextField label="Activity" value={a.title} onChange={(v) => set(a.id, { title: v })} error={errors[`activities.${i}.title`]} placeholder="School Robotics Club" />
              </FieldGrid>
              <FieldGrid>
                <TextField label="Organisation" optional value={a.organization} onChange={(v) => set(a.id, { organization: v })} placeholder="Tbilisi Public School No. 51" />
                <TextField label="Your role" optional value={a.role} onChange={(v) => set(a.id, { role: v })} placeholder="President" />
              </FieldGrid>
              <FieldGrid>
                <MonthField label="From" optional value={a.startDate} onChange={(v) => set(a.id, { startDate: v })} />
                <MonthField label="To" optional value={a.endDate} onChange={(v) => set(a.id, { endDate: v })} hint="Leave empty if ongoing." />
              </FieldGrid>
              <TextAreaField label="What you did" optional rows={2} value={a.description} onChange={(v) => set(a.id, { description: v })} placeholder="Led a 20-member club and organised the school's first robotics exhibition." />
            </EntryCard>
          ))}
          <AddEntryButton label="Add another activity" onClick={add} />
        </div>
      )}
    </div>
  );
}
