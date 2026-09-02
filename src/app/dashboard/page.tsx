import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  title: "My CVs",
  robots: { index: false },
};

export default function DashboardPage() {
  return (
    <SiteShell>
      <DashboardView />
    </SiteShell>
  );
}
