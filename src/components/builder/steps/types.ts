import type { CVData } from "@/lib/cv/types";
import type { FieldErrors } from "@/lib/cv/validation";

export interface StepProps {
  data: CVData;
  update: (updater: (data: CVData) => CVData) => void;
  errors: FieldErrors;
}

/** Helper for immutable updates of one item in an array by id. */
export function updateItem<T extends { id: string }>(list: T[], id: string, patch: Partial<T>): T[] {
  return list.map((item) => (item.id === id ? { ...item, ...patch } : item));
}
