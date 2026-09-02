"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSavedCV } from "@/lib/cv/defaults";
import type { CVData, CVDocument, CVReview, SavedCV, TemplateId } from "@/lib/cv/types";

/**
 * Browser-persisted CV storage for the MVP. The public API of this store is
 * intentionally shaped like a repository so it can be swapped for a
 * database-backed implementation once accounts exist.
 */
interface CVStore {
  cvs: Record<string, SavedCV>;
  hasHydrated: boolean;
  setHasHydrated: () => void;
  createCV: (name?: string) => SavedCV;
  getCV: (id: string) => SavedCV | undefined;
  updateData: (id: string, updater: (data: CVData) => CVData) => void;
  setTemplate: (id: string, templateId: TemplateId) => void;
  setDocument: (id: string, document: CVDocument | null) => void;
  setReview: (id: string, review: CVReview | null) => void;
  renameCV: (id: string, name: string) => void;
  duplicateCV: (id: string) => SavedCV | undefined;
  deleteCV: (id: string) => void;
  importCV: (cv: SavedCV) => void;
}

/** Name derived from the student's name; used until the user renames the CV. */
function autoName(data: CVData): string {
  const fullName = `${data.personal.firstName} ${data.personal.lastName}`.trim();
  return fullName ? `${fullName} — CV` : "Untitled CV";
}

function touch(cv: SavedCV, patch: Partial<SavedCV>): SavedCV {
  return { ...cv, ...patch, updatedAt: new Date().toISOString() };
}

export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
      cvs: {},
      hasHydrated: false,
      setHasHydrated: () => set({ hasHydrated: true }),

      createCV: (name) => {
        const cv = createSavedCV(name ? { name } : undefined);
        set((s) => ({ cvs: { ...s.cvs, [cv.id]: cv } }));
        return cv;
      },

      getCV: (id) => get().cvs[id],

      updateData: (id, updater) =>
        set((s) => {
          const cv = s.cvs[id];
          if (!cv) return s;
          const data = updater(cv.data);
          const name = cv.name === autoName(cv.data) ? autoName(data) : cv.name;
          return {
            cvs: { ...s.cvs, [id]: touch(cv, { data, name, dataUpdatedAt: new Date().toISOString() }) },
          };
        }),

      setTemplate: (id, templateId) =>
        set((s) => {
          const cv = s.cvs[id];
          if (!cv) return s;
          return { cvs: { ...s.cvs, [id]: touch(cv, { templateId }) } };
        }),

      setDocument: (id, document) =>
        set((s) => {
          const cv = s.cvs[id];
          if (!cv) return s;
          return {
            cvs: {
              ...s.cvs,
              [id]: touch(cv, {
                document,
                generatedAt: document ? new Date().toISOString() : null,
              }),
            },
          };
        }),

      setReview: (id, review) =>
        set((s) => {
          const cv = s.cvs[id];
          if (!cv) return s;
          return { cvs: { ...s.cvs, [id]: touch(cv, { review }) } };
        }),

      renameCV: (id, name) =>
        set((s) => {
          const cv = s.cvs[id];
          if (!cv) return s;
          return { cvs: { ...s.cvs, [id]: touch(cv, { name: name.trim() || cv.name }) } };
        }),

      duplicateCV: (id) => {
        const source = get().cvs[id];
        if (!source) return undefined;
        const copy = createSavedCV({
          ...source,
          id: undefined,
          name: `${source.name} (copy)`,
        });
        set((s) => ({ cvs: { ...s.cvs, [copy.id]: copy } }));
        return copy;
      },

      deleteCV: (id) =>
        set((s) => {
          const next = { ...s.cvs };
          delete next[id];
          return { cvs: next };
        }),

      importCV: (cv) => set((s) => ({ cvs: { ...s.cvs, [cv.id]: cv } })),
    }),
    {
      name: "eurocv:cvs",
      version: 1,
      partialize: (s) => ({ cvs: s.cvs }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated();
      },
    },
  ),
);

export function useHasHydrated(): boolean {
  return useCVStore((s) => s.hasHydrated);
}

export function sortedCVs(cvs: Record<string, SavedCV>): SavedCV[] {
  return Object.values(cvs).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
