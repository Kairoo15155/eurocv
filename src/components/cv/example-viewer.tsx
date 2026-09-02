"use client";

import { useState } from "react";
import { CVPaper } from "@/components/cv/cv-paper";
import { TemplatePicker } from "@/components/cv/template-picker";
import { EXAMPLE_DOCUMENT } from "@/lib/cv/example";
import type { TemplateId } from "@/lib/cv/types";

export function ExampleViewer() {
  const [templateId, setTemplateId] = useState<TemplateId>("modern");
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <h2 className="text-sm font-semibold">Template</h2>
        <p className="mt-1 text-sm text-muted-foreground">Same content, three layouts.</p>
        <div className="mt-4">
          <TemplatePicker value={templateId} onChange={setTemplateId} showLocks={false} />
        </div>
      </aside>
      <div className="rounded-xl border border-border bg-canvas p-3 sm:p-8">
        <CVPaper document={EXAMPLE_DOCUMENT} templateId={templateId} />
      </div>
    </div>
  );
}
