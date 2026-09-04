"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, EyeIcon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { GeneratingScreen } from "@/components/builder/generating-screen";
import { StepProgress } from "@/components/builder/step-progress";
import { BUILDER_STEPS } from "@/components/builder/steps";
import { STEP_COMPONENTS } from "@/components/builder/steps/index";
import { CVPaper } from "@/components/cv/cv-paper";
import { TemplatePicker } from "@/components/cv/template-picker";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, generateCVRequest } from "@/lib/api/client";
import { toDocument } from "@/lib/cv/to-document";
import type { CVData } from "@/lib/cv/types";
import { validateAll, validateStep, type FieldErrors } from "@/lib/cv/validation";
import { useCVStore, useHasHydrated } from "@/lib/store/cv-store";
import { useAccount } from "@/lib/store/user-store";

export function BuilderShell({ id, initialStep = 0 }: { id: string; initialStep?: number }) {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const cv = useCVStore((s) => s.cvs[id]);
  const updateData = useCVStore((s) => s.updateData);
  const setTemplate = useCVStore((s) => s.setTemplate);
  const setDocument = useCVStore((s) => s.setDocument);
  const { aiAvailable } = useAccount();

  const [step, setStep] = useState(Math.min(Math.max(initialStep, 0), BUILDER_STEPS.length - 1));
  const [maxReached, setMaxReached] = useState(step);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const formTop = useRef<HTMLDivElement>(null);

  const data = cv?.data;
  const document = useMemo(() => (data ? toDocument(data) : null), [data]);

  const update = useCallback(
    (updater: (d: CVData) => CVData) => {
      updateData(id, updater);
      // Clear errors as the user fixes fields; full validation runs on Continue.
      setErrors((prev) => (Object.keys(prev).length ? {} : prev));
    },
    [id, updateData],
  );

  const goTo = (next: number) => {
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
    setErrors({});
    formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleContinue = () => {
    if (!data) return;
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    if (step < BUILDER_STEPS.length - 1) goTo(step + 1);
    else void generate();
  };

  const generate = async () => {
    if (!data) return;
    const invalid = validateAll(data);
    if (invalid) {
      setStep(invalid.step);
      setErrors(invalid.errors);
      toast.error(`Some information on the “${BUILDER_STEPS[invalid.step].label}” step needs attention.`);
      return;
    }
    if (!aiAvailable) {
      // No AI on this server: finish with the student's own wording.
      setDocument(id, null);
      toast.info("AI polishing isn’t available right now, so your CV uses your own wording.");
      router.push(`/cv/${id}`);
      return;
    }
    setGenerating(true);
    setGenerationError(null);
    try {
      const generated = await generateCVRequest(data);
      setDocument(id, generated);
      router.push(`/cv/${id}`);
    } catch (error) {
      setGenerationError(
        error instanceof ApiError ? error.message : "We couldn't generate your CV right now. Please try again.",
      );
    }
  };

  useEffect(() => {
    if (!generating) return;
    const beforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [generating]);

  if (!hydrated) return <BuilderSkeleton />;

  if (!cv || !data || !document) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-2xl font-semibold">We couldn’t find that CV</h1>
        <p className="max-w-sm text-muted-foreground">It may have been deleted, or it was created in a different browser.</p>
        <ButtonLink href="/dashboard">Go to my CVs</ButtonLink>
      </div>
    );
  }

  const StepComponent = STEP_COMPONENTS[step];
  const isLast = step === BUILDER_STEPS.length - 1;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <p className="hidden max-w-[240px] truncate text-sm text-muted-foreground sm:block">{cv.name}</p>
            <ButtonLink variant="ghost" className="h-9" href="/dashboard">
              Save &amp; exit
            </ButtonLink>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,44%)] lg:py-8">
        <div ref={formTop} className="scroll-mt-20">
          <StepProgress current={step} maxReached={maxReached} onSelect={goTo} />
          <div className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
            <StepComponent data={data} update={update} errors={errors} />
          </div>
          <div className="mt-5 flex items-center justify-between gap-3 pb-24 lg:pb-0">
            <Button variant="outline" className="h-11 px-4" disabled={step === 0} onClick={() => goTo(step - 1)}>
              <ArrowLeftIcon data-icon="inline-start" />
              Back
            </Button>
            <Button className="h-11 px-5" onClick={handleContinue}>
              {isLast ? (
                aiAvailable ? (
                  <>
                    <SparklesIcon data-icon="inline-start" />
                    Generate my CV
                  </>
                ) : (
                  <>
                    Finish my CV
                    <ArrowRightIcon data-icon="inline-end" />
                  </>
                )
              ) : (
                <>
                  Continue
                  <ArrowRightIcon data-icon="inline-end" />
                </>
              )}
            </Button>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-[88px] flex max-h-[calc(100vh-112px)] flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Live preview</p>
              <span className="text-xs text-muted-foreground">Updates as you type</span>
            </div>
            <TemplatePicker value={cv.templateId} onChange={(t) => setTemplate(id, t)} layout="row" />
            <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border bg-slate-100/80 p-4">
              <CVPaper document={document} templateId={cv.templateId} />
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-3 backdrop-blur-md lg:hidden">
        <Button variant="outline" className="h-11 w-full" onClick={() => setPreviewOpen(true)}>
          <EyeIcon data-icon="inline-start" />
          Preview CV
        </Button>
      </div>
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0">
          <SheetTitle className="sr-only">CV preview</SheetTitle>
          <div className="flex h-full flex-col">
            <div className="border-b border-border px-4 pt-3 pb-3 pr-12">
              <p className="font-medium">Preview</p>
              <div className="mt-2 max-w-[360px]">
                <TemplatePicker value={cv.templateId} onChange={(t) => setTemplate(id, t)} layout="row" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-100/80 p-3">
              <CVPaper document={document} templateId={cv.templateId} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {generating && (
        <GeneratingScreen
          error={generationError}
          onRetry={() => void generate()}
          onCancel={() => {
            setGenerating(false);
            setGenerationError(null);
          }}
        />
      )}
    </div>
  );
}

function BuilderSkeleton() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-14 border-b border-border bg-background" />
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,44%)]">
        <div className="space-y-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="mt-6 h-[520px] w-full rounded-2xl" />
        </div>
        <Skeleton className="hidden h-[640px] rounded-xl lg:block" />
      </div>
    </div>
  );
}
