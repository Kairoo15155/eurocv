"use client";

import Link from "next/link";
import { useState } from "react";
import { CopyIcon, DownloadIcon, EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { CVPaper } from "@/components/cv/cv-paper";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ApiError, downloadPdf } from "@/lib/api/client";
import { formatRelativeTime } from "@/lib/cv/format";
import { TEMPLATES } from "@/lib/cv/options";
import { toDocument } from "@/lib/cv/to-document";
import type { SavedCV } from "@/lib/cv/types";
import { useCVStore } from "@/lib/store/cv-store";

export function CVCard({ cv, isPro, onUpgrade }: { cv: SavedCV; isPro: boolean; onUpgrade: () => void }) {
  const deleteCV = useCVStore((s) => s.deleteCV);
  const duplicateCV = useCVStore((s) => s.duplicateCV);
  const renameCV = useCVStore((s) => s.renameCV);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(cv.name);
  const [downloading, setDownloading] = useState(false);

  const document = cv.document ?? toDocument(cv.data);
  const template = TEMPLATES.find((t) => t.id === cv.templateId);

  const download = async () => {
    if (!isPro) return onUpgrade();
    setDownloading(true);
    try {
      await downloadPdf(document, cv.templateId);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "We couldn't create your PDF right now. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-[0_12px_40px_-16px_rgba(15,23,42,0.25)]">
      <Link href={`/cv/${cv.id}`} className="block bg-slate-100/80 p-3">
        <div className="max-h-[220px] overflow-hidden rounded-[2px] [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]">
          <CVPaper document={document} templateId={cv.templateId} shadow={false} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {renaming ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  renameCV(cv.id, name);
                  setRenaming(false);
                }}
              >
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => {
                    renameCV(cv.id, name);
                    setRenaming(false);
                  }}
                  className="w-full rounded-md border border-input px-2 py-1 text-sm font-medium"
                  aria-label="CV name"
                />
              </form>
            ) : (
              <h3 className="truncate font-medium">{cv.name}</h3>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground">
              Edited {formatRelativeTime(cv.updatedAt)} · {template?.name ?? "Classic"}
              {cv.document ? " · AI generated" : " · Draft"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="More actions" />}>
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRenaming(true)}>
                <PencilIcon /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (!isPro) return onUpgrade();
                  duplicateCV(cv.id);
                  toast.success("CV duplicated.");
                }}
              >
                <CopyIcon /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}>
                <Trash2Icon /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ButtonLink variant="outline" size="sm" className="h-9" href={`/builder/${cv.id}`}>
            <PencilIcon data-icon="inline-start" />
            Edit
          </ButtonLink>
          <ButtonLink variant="outline" size="sm" className="h-9" href={`/cv/${cv.id}`}>
            <EyeIcon data-icon="inline-start" />
            Preview
          </ButtonLink>
          <Button size="sm" className="h-9" onClick={() => void download()} disabled={downloading}>
            <DownloadIcon data-icon="inline-start" />
            {downloading ? "…" : "PDF"}
          </Button>
        </div>
      </div>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete “{cv.name}”?</DialogTitle>
            <DialogDescription>This removes the CV from this browser. It can’t be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteCV(cv.id);
                toast.success("CV deleted.");
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
