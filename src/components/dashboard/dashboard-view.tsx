"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { CVCard } from "@/components/dashboard/cv-card";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Skeleton } from "@/components/ui/skeleton";
import { sortedCVs, useCVStore, useHasHydrated } from "@/lib/store/cv-store";

export function DashboardView() {
  const hydrated = useHasHydrated();
  const cvs = useCVStore((s) => s.cvs);
  const { user, enabled: authEnabled } = useAuth();
  const list = sortedCVs(cvs);

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My CVs</h1>
          <p className="mt-1 text-muted-foreground">
            {user ? (
              <>Saved to your account ({user.email}).</>
            ) : authEnabled ? (
              <>
                Saved in this browser.{" "}
                <Link href="/signin?next=/dashboard" className="font-medium text-foreground underline underline-offset-4">
                  Sign in
                </Link>{" "}
                to keep them on every device.
              </>
            ) : (
              <>Saved in this browser.</>
            )}
          </p>
        </div>
        <ButtonLink className="h-11 px-5" href="/builder/new">
          <PlusIcon data-icon="inline-start" />
          Create new CV
        </ButtonLink>
      </div>

      {!hydrated ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[340px] rounded-xl" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-canvas p-12 text-center">
          <h2 className="text-lg font-semibold">No CVs yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
            Your first CV takes about ten minutes. You can come back and edit it at any time.
          </p>
          <ButtonLink className="mt-6 h-11 px-5" href="/builder/new">
            <PlusIcon data-icon="inline-start" />
            Create my first CV
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((cv) => (
            <CVCard key={cv.id} cv={cv} />
          ))}
        </div>
      )}
    </Container>
  );
}
