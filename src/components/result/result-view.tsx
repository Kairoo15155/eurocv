"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangleIcon, DownloadIcon, PencilIcon, RefreshCwIcon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { GeneratingScreen } from "@/components/builder/generating-screen";
import { CVPaper } from "@/components/cv/cv-paper";
import { TemplatePicker } from "@/components/cv/template-picker";
import { SiteShell } from "@/components/layout/site-shell";
import { ImprovePanel } from "@/components/result/improve-panel";
import { UpgradeDialog } from "@/components/result/upgrade-dialog";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ApiError,
  applyImprovementsRequest,
  downloadPdf,
  generateCVRequest,
  reviewCVRequest,
} from "@/lib/api/client";
import { FREE_TEMPLATE, TEMPLATES } from "@/lib/cv/options";
import { toDocument } from "@/lib/cv/to-document";
import type { ReviewSuggestion, TemplateId } from "@/lib/cv/types";
import { useCVStore, useHasHydrated } from "@/lib/store/cv-store";
import { useIsPro } from "@/lib/store/user-store";

export function ResultView({ id }: { id: string }) {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const cv = useCVStore((s) => s.cvs[id]);
  const setTemplate = useCVStore((s) => s.setTemplate);
  const setDocument = useCVStore((s) => s.setDocument);
  const setReview = useCVStore((s) => s.setReview);
  const isPro = useIsPro();

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string | undefined>();
  const [downloading, setDownloading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenError, setRegenError] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [tab, setTab] = useState("preview");

  if (!hydrated) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-6xl px-5 py-10">
          <Skeleton className="h-8 w-64" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
            <Skeleton className="h-96 rounded-xl" />
            <Skeleton className="h-[800px] rounded-xl" />
          </div>
        </div>
      </SiteShell>
    );
  }

  if (!cv) {
    return (
      <SiteShell>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 text-center">
          <h1 className="text-2xl font-semibold">We couldn’t find that CV</h1>
          <p className="max-w-sm text-muted-foreground">It may have been deleted, or it was created in a different browser.</p>
          <ButtonLink href="/dashboard">Go to my CVs</ButtonLink>
        </div>
      </SiteShell>
    );
  }

  const document = cv.document ?? toDocument(cv.data);
  const generated = Boolean(cv.document);
  const stale = Boolean(cv.generatedAt && cv.dataUpdatedAt > cv.generatedAt);
  const returnTo = `/cv/${id}`;

  const requirePro = (reason: string) => {
    if (isPro) return true;
    setUpgradeReason(reason);
    setUpgradeOpen(true);
    return false;
  };

  const handleTemplate = (t: TemplateId) => {
    const template = TEMPLATES.find((x) => x.id === t);
    if (template?.pro && !requirePro(`The ${template.name} template is included in EuroCV Pro.`)) return;
    setTemplate(id, t);
  };

  const handleDownload = async () => {
    if (!requirePro("PDF download is included in EuroCV Pro.")) return;
    setDownloading(true);
    try {
      await downloadPdf(document, cv.templateId);
      toast.success("Your CV is downloading.");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "We couldn't create your PDF right now. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const regenerate = async () => {
    setRegenerating(true);
    setRegenError(null);
    try {
      const doc = await generateCVRequest(cv.data);
      setDocument(id, doc);
      setReview(id, null);
      setRegenerating(false);
      toast.success("Your CV has been regenerated.");
    } catch (error) {
      setRegenError(error instanceof ApiError ? error.message : "We couldn't generate your CV right now. Please try again.");
    }
  };

  const runReview = async () => {
    if (!requirePro("AI CV improvement is included in EuroCV Pro.")) return;
    setReviewing(true);
    setReviewError(null);
    try {
      const review = await reviewCVRequest(document, cv.data);
      setReview(id, review);
    } catch (error) {
      setReviewError(error instanceof ApiError ? error.message : "We couldn't review your CV right now. Please try again.");
    } finally {
      setReviewing(false);
    }
  };

  const applySuggestions = async (suggestions: ReviewSuggestion[]) => {
    setApplying(true);
    try {
      const doc = await applyImprovementsRequest(document, suggestions, cv.data);
      setDocument(id, doc);
      toast.success("Improvements applied. Review the changes in the preview.");
      setTab("preview");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "We couldn't apply the improvements right now. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const templateName = TEMPLATES.find((t) => t.id === cv.templateId)?.name ?? "Classic";
  const effectiveTemplate: TemplateId =
    !isPro && TEMPLATES.find((t) => t.id === cv.templateId)?.pro ? FREE_TEMPLATE : cv.templateId;

  const sidebar = (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-white p-5">
        <h2 className="font-semibold">Template</h2>
        <p className="mt-1 text-sm text-muted-foreground">Switch anytime. Your information stays the same.</p>
        <div className="mt-4">
          <TemplatePicker value={effectiveTemplate} onChange={handleTemplate} isPro={isPro} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5">
        <h2 className="font-semibold">Actions</h2>
        <div className="mt-4 flex flex-col gap-2">
          <Button className="h-11 w-full" onClick={handleDownload} disabled={downloading}>
            <DownloadIcon data-icon="inline-start" />
            {downloading ? "Preparing PDF…" : "Download PDF"}
          </Button>
          <ButtonLink variant="outline" className="h-10 w-full" href={`/builder/${id}`}>
            <PencilIcon data-icon="inline-start" />
            Edit information
          </ButtonLink>
          <Button variant="outline" className="h-10 w-full" onClick={() => void regenerate()}>
            <RefreshCwIcon data-icon="inline-start" />
            {generated ? "Regenerate with AI" : "Generate with AI"}
          </Button>
        </div>
        {!isPro && (
          <p className="mt-3 text-xs text-muted-foreground">
            Free plan: preview with the Classic template. PDF download, all templates and AI review are part of{" "}
            <Link href="/pricing" className="underline underline-offset-2">
              Pro (€4.99)
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );

  return (
    <SiteShell>
      <div className="border-b border-border bg-canvas">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">
                My CVs
              </Link>{" "}
              / {cv.name}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">{generated ? "Your CV is ready" : "Your CV"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {templateName} template · {document.header.fullName || "No name yet"}
            </p>
          </div>
        </div>
      </div>

      {(stale || !generated) && (
        <div className="mx-auto mt-6 max-w-[1400px] px-5 sm:px-8">
          <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
              <p>
                {generated
                  ? "You've edited your information since this CV was generated. Regenerate to bring the wording up to date."
                  : "This is a plain preview of your information. Generate with AI to get professionally written content."}
              </p>
            </div>
            <Button size="sm" className="shrink-0" onClick={() => void regenerate()}>
              <SparklesIcon data-icon="inline-start" />
              {generated ? "Regenerate" : "Generate with AI"}
            </Button>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            {sidebar}
            <ImprovePanel
              review={cv.review}
              loading={reviewing}
              applying={applying}
              error={reviewError}
              onRun={() => void runReview()}
              onApply={(s) => void applySuggestions(s)}
            />
          </div>
        </aside>

        <div className="lg:hidden">
          <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
            <TabsList className="w-full">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="improve">Improve</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              <div className="rounded-xl border border-border bg-slate-100/80 p-2">
                <CVPaper document={document} templateId={effectiveTemplate} />
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Button className="h-11 w-full" onClick={handleDownload} disabled={downloading}>
                  <DownloadIcon data-icon="inline-start" />
                  {downloading ? "Preparing PDF…" : "Download PDF"}
                </Button>
                <ButtonLink variant="outline" className="h-10 w-full" href={`/builder/${id}`}>
                  <PencilIcon data-icon="inline-start" />
                  Edit information
                </ButtonLink>
              </div>
            </TabsContent>
            <TabsContent value="template" className="mt-4">
              {sidebar}
            </TabsContent>
            <TabsContent value="improve" className="mt-4">
              <ImprovePanel
                review={cv.review}
                loading={reviewing}
                applying={applying}
                error={reviewError}
                onRun={() => void runReview()}
                onApply={(s) => void applySuggestions(s)}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden lg:block">
          <div className="rounded-xl border border-border bg-slate-100/80 p-6">
            <CVPaper document={document} templateId={effectiveTemplate} />
          </div>
        </div>
      </div>

      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} returnTo={returnTo} reason={upgradeReason} />

      {regenerating && (
        <GeneratingScreen
          title={generated ? "Updating your CV..." : "Creating your CV..."}
          error={regenError}
          onRetry={() => void regenerate()}
          onCancel={() => {
            setRegenerating(false);
            setRegenError(null);
            router.refresh();
          }}
        />
      )}
    </SiteShell>
  );
}
