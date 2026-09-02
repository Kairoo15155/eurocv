"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { SavedCV } from "@/lib/cv/types";
import { useCVStore } from "@/lib/store/cv-store";

/**
 * Keeps a signed-in user's CVs in the database while the zustand store
 * stays the in-memory source of truth for the UI. On sign-in, remote CVs
 * are loaded and any CVs created anonymously in this browser are uploaded
 * to the account. Afterwards every change is written through (debounced).
 */

interface CVRow {
  id: string;
  user_id: string;
  name: string;
  template_id: SavedCV["templateId"];
  data: SavedCV["data"];
  document: SavedCV["document"];
  review: SavedCV["review"];
  generated_at: string | null;
  data_updated_at: string;
  created_at: string;
  updated_at: string;
}

function rowToCV(row: CVRow): SavedCV {
  return {
    id: row.id,
    name: row.name,
    templateId: row.template_id,
    data: row.data,
    document: row.document,
    review: row.review,
    generatedAt: row.generated_at,
    dataUpdatedAt: row.data_updated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function cvToRow(cv: SavedCV, userId: string): CVRow {
  return {
    id: cv.id,
    user_id: userId,
    name: cv.name,
    template_id: cv.templateId,
    data: cv.data,
    document: cv.document,
    review: cv.review,
    generated_at: cv.generatedAt,
    data_updated_at: cv.dataUpdatedAt,
    created_at: cv.createdAt,
    updated_at: cv.updatedAt,
  };
}

const DEBOUNCE_MS = 800;

/** Starts syncing; returns a stop function. */
export function startCVSync(supabase: SupabaseClient, userId: string): () => void {
  let stopped = false;
  let unsubscribe: (() => void) | null = null;
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  const upsert = async (cv: SavedCV) => {
    const { error } = await supabase.from("cvs").upsert(cvToRow(cv, userId));
    if (error) console.warn("[eurocv] CV sync failed", error.message);
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("cvs").delete().eq("id", id).eq("user_id", userId);
    if (error) console.warn("[eurocv] CV delete failed", error.message);
  };

  (async () => {
    const { data, error } = await supabase.from("cvs").select("*").eq("user_id", userId);
    if (stopped) return;
    if (error) {
      console.warn("[eurocv] could not load CVs", error.message);
      return;
    }
    const rows = (data ?? []) as CVRow[];
    const store = useCVStore.getState();
    const remoteIds = new Set(rows.map((r) => r.id));
    const localOnly = Object.values(store.cvs).filter((cv) => !remoteIds.has(cv.id));

    // Remote wins for CVs that exist in both places; anonymous local CVs move to the account.
    for (const row of rows) store.importCV(rowToCV(row));
    if (localOnly.length) {
      const { error: upErr } = await supabase.from("cvs").upsert(localOnly.map((cv) => cvToRow(cv, userId)));
      if (upErr) console.warn("[eurocv] could not upload local CVs", upErr.message);
    }
    if (stopped) return;

    let prev = useCVStore.getState().cvs;
    unsubscribe = useCVStore.subscribe((state) => {
      const next = state.cvs;
      if (next === prev) return;
      for (const id of Object.keys(next)) {
        if (next[id] !== prev[id]) {
          clearTimeout(timers.get(id));
          timers.set(
            id,
            setTimeout(() => {
              timers.delete(id);
              const latest = useCVStore.getState().cvs[id];
              if (latest) void upsert(latest);
            }, DEBOUNCE_MS),
          );
        }
      }
      for (const id of Object.keys(prev)) {
        if (!(id in next)) {
          clearTimeout(timers.get(id));
          timers.delete(id);
          void remove(id);
        }
      }
      prev = next;
    });
  })();

  return () => {
    stopped = true;
    unsubscribe?.();
    for (const t of timers.values()) clearTimeout(t);
  };
}
