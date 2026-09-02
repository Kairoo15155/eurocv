import type { Metadata } from "next";
import { BuilderShell } from "@/components/builder/builder-shell";

export const metadata: Metadata = {
  title: "CV builder",
  robots: { index: false },
};

export default async function BuilderPage(props: PageProps<"/builder/[id]">) {
  const { id } = await props.params;
  const search = await props.searchParams;
  const rawStep = Array.isArray(search.step) ? search.step[0] : search.step;
  const initialStep = rawStep ? Number.parseInt(rawStep, 10) || 0 : 0;
  return <BuilderShell id={id} initialStep={initialStep} />;
}
