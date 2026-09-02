"use client";

import { StepHeader } from "@/components/builder/step-header";
import { TagInput } from "@/components/builder/tag-input";
import { SKILL_SUGGESTIONS } from "@/lib/cv/options";
import type { StepProps } from "./types";

export function SkillsStep({ data, update }: StepProps) {
  return (
    <div>
      <StepHeader
        title="Skills"
        description="Technical skills first, then a few soft skills. Press Enter or comma after each one. Only list what you can actually demonstrate."
      />
      <div className="flex flex-col gap-8">
        <TagInput
          label="Technical skills"
          value={data.skills.technical}
          onChange={(technical) => update((d) => ({ ...d, skills: { ...d.skills, technical } }))}
          suggestions={SKILL_SUGGESTIONS.technical}
          placeholder="Python, Excel, AutoCAD…"
          hint="Programming languages, software, tools, lab techniques, design tools."
        />
        <TagInput
          label="Soft skills"
          value={data.skills.soft}
          onChange={(soft) => update((d) => ({ ...d, skills: { ...d.skills, soft } }))}
          suggestions={SKILL_SUGGESTIONS.soft}
          placeholder="Leadership, Communication…"
          hint="Keep it to three or four you can back up with an activity or experience."
        />
      </div>
    </div>
  );
}
