"use client";

import { FieldGrid, MonthField, SelectField, SelectOrCustomField, TextField } from "@/components/builder/fields";
import { AddEntryButton, EntryCard } from "@/components/builder/entry-card";
import { StepHeader } from "@/components/builder/step-header";
import { Button } from "@/components/ui/button";
import { emptyLanguage, emptyTestScore } from "@/lib/cv/defaults";
import { CEFR_LEVELS, COMMON_LANGUAGES, LANGUAGE_TESTS } from "@/lib/cv/options";
import type { LanguageTest } from "@/lib/cv/types";
import { updateItem, type StepProps } from "./types";
import { PlusIcon } from "lucide-react";

export function LanguagesStep({ data, update, errors }: StepProps) {
  const setLang = (id: string, patch: Partial<(typeof data.languages)[number]>) =>
    update((d) => ({ ...d, languages: updateItem(d.languages, id, patch) }));
  const setTest = (id: string, patch: Partial<(typeof data.testScores)[number]>) =>
    update((d) => ({ ...d, testScores: updateItem(d.testScores, id, patch) }));

  return (
    <div>
      <StepHeader
        title="Languages"
        description="Universities look for CEFR levels. If you have an IELTS or TOEFL score, add it — it's often required for admission."
      />
      <div className="flex flex-col gap-4">
        {data.languages.map((l, i) => (
          <EntryCard
            key={l.id}
            title="Language"
            index={i}
            onRemove={() => update((d) => ({ ...d, languages: d.languages.filter((x) => x.id !== l.id) }))}
          >
            <FieldGrid>
              <SelectOrCustomField
                label="Language"
                value={l.language}
                onChange={(v) => setLang(l.id, { language: v })}
                options={COMMON_LANGUAGES}
                error={errors[`languages.${i}.language`]}
                placeholder="Choose a language"
              />
              <SelectField label="Level" value={l.level} onChange={(v) => setLang(l.id, { level: v })} options={CEFR_LEVELS} />
            </FieldGrid>
          </EntryCard>
        ))}
        <AddEntryButton label="Add a language" onClick={() => update((d) => ({ ...d, languages: [...d.languages, emptyLanguage()] }))} />
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Language test scores</h3>
            <p className="text-sm text-muted-foreground">IELTS, TOEFL, Goethe and similar certificates.</p>
          </div>
          {data.testScores.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => update((d) => ({ ...d, testScores: [...d.testScores, emptyTestScore()] }))}>
              <PlusIcon data-icon="inline-start" />
              Add test
            </Button>
          )}
        </div>
        {data.testScores.length === 0 ? (
          <AddEntryButton label="Add IELTS / TOEFL score" onClick={() => update((d) => ({ ...d, testScores: [...d.testScores, emptyTestScore()] }))} />
        ) : (
          <div className="flex flex-col gap-4">
            {data.testScores.map((t, i) => (
              <EntryCard
                key={t.id}
                title="Test"
                index={i}
                onRemove={() => update((d) => ({ ...d, testScores: d.testScores.filter((x) => x.id !== t.id) }))}
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <SelectField<LanguageTest>
                    label="Test"
                    value={t.test}
                    onChange={(v) => setTest(t.id, { test: v })}
                    options={LANGUAGE_TESTS.map((x) => ({ value: x, label: x }))}
                  />
                  <TextField label="Score" value={t.score} onChange={(v) => setTest(t.id, { score: v })} error={errors[`testScores.${i}.score`]} placeholder={t.test === "IELTS" ? "7.5" : t.test === "TOEFL" ? "102" : "C1"} />
                  <MonthField label="Date" optional value={t.date} onChange={(v) => setTest(t.id, { date: v })} />
                </div>
              </EntryCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
