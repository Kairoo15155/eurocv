import type { Metadata } from "next";
import { ResultView } from "@/components/result/result-view";

export const metadata: Metadata = {
  title: "Your CV",
  robots: { index: false },
};

export default async function CVPage(props: PageProps<"/cv/[id]">) {
  const { id } = await props.params;
  return <ResultView id={id} />;
}
