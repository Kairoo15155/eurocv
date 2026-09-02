"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCVStore, useHasHydrated } from "@/lib/store/cv-store";
import { Skeleton } from "@/components/ui/skeleton";

/** Creates a fresh CV in local storage and sends the user into the builder. */
export function NewCVRedirect() {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const createCV = useCVStore((s) => s.createCV);
  const created = useRef(false);

  useEffect(() => {
    if (!hydrated || created.current) return;
    created.current = true;
    const cv = createCV();
    router.replace(`/builder/${cv.id}`);
  }, [hydrated, createCV, router]);

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-14 border-b border-border bg-background" />
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <Skeleton className="h-[520px] w-full rounded-2xl" />
      </div>
    </div>
  );
}
