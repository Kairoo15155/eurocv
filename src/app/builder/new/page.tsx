import type { Metadata } from "next";
import { NewCVRedirect } from "@/components/builder/new-cv-redirect";

export const metadata: Metadata = {
  title: "Create my CV",
  robots: { index: false },
};

export default function NewCVPage() {
  return <NewCVRedirect />;
}
