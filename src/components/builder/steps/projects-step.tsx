"use client";

import { useState } from "react";
import { LightbulbIcon } from "lucide-react";
import { FieldGrid, MonthField, TextAreaField, TextField } from "@/components/builder/fields";
import { AddEntryButton, EmptyState, EntryCard } from "@/components/builder/entry-card";
import { StepHeader } from "@/components/builder/step-header";
import { Button } from "@/components/ui/button";
import { emptyProject } from "@/lib/cv/defaults";
import { PROJECT_EXAMPLES } from "@/lib/cv/options";
import { updateItem, type StepProps } from "./types";
import { cn } from "@/lib/utils";

export function ProjectsStep({ data, update, errors }: StepProps) {
  const add = () => update((d) => ({ ...d, projects: [...d.projects, emptyProject()] }));
  const set = (id: string, patch: Partial<(typeof data.projects)[number]>) =>
    update((d) => ({ ...d, projects: updateItem(d.projects, id, patch) }));

  return (
    <div>
      <StepHeader
        title="Projects"
        description="Anything you built, researched, organised or created — for school, a competition, or on your own. Projects are the best evidence of interest in your field."
      />
      <ProjectExamples />
      {data.projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          text="Even a small school project counts. Describe what you did in plain words; the AI will make it read professionally."
          action={<Button onClick={add}>Add a project</Button>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {data.projects.map((p, i) => (
            <EntryCard key={p.id} title="Project" index={i} onRemove={() => update((d) => ({ ...d, projects: d.projects.filter((x) => x.id !== p.id) }))}>
              <FieldGrid>
                <TextField label="Project name" value={p.name} onChange={(v) => set(p.id, { name: v })} error={errors[`projects.${i}.name`]} placeholder="TbilisiTransit" />
                <MonthField label="Date" optional value={p.date} onChange={(v) => set(p.id, { date: v })} hint="When it was finished or presented." />
              </FieldGrid>
              <TextAreaField
                label="Description"
                value={p.description}
                onChange={(v) => set(p.id, { description: v })}
                placeholder="What did you build or study? What was the result? Numbers help: users, accuracy, participants."
              />
              <FieldGrid>
                <TextField label="Technologies or tools" optional value={p.technologies} onChange={(v) => set(p.id, { technologies: v })} placeholder="Python, PyTorch" />
                <TextField label="Link" optional value={p.link} onChange={(v) => set(p.id, { link: v })} error={errors[`projects.${i}.link`]} placeholder="github.com/you/project" />
              </FieldGrid>
            </EntryCard>
          ))}
          <AddEntryButton label="Add another project" onClick={add} />
        </div>
      )}
    </div>
  );
}

function ProjectExamples() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6 rounded-xl border border-brand/20 bg-brand-soft/50 p-4">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2 text-left text-sm font-medium text-brand">
        <LightbulbIcon className="size-4" />
        Not sure what counts as a project? See examples by field
        <span className={cn("ml-auto text-xs transition-transform", open && "rotate-180")}>▾</span>
      </button>
      {open && (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {PROJECT_EXAMPLES.map((ex) => (
            <li key={ex.field} className="rounded-lg bg-white/80 p-3 text-sm">
              <p className="text-xs font-semibold text-brand uppercase">{ex.field}</p>
              <p className="mt-1 leading-snug text-foreground/80">{ex.example}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
