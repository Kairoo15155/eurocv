import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { WelcomeView } from "@/components/pricing/welcome-view";

export const metadata: Metadata = {
  title: "Welcome to Pro",
  robots: { index: false },
};

export default async function WelcomePage(props: PageProps<"/welcome">) {
  const search = await props.searchParams;
  const raw = Array.isArray(search.return) ? search.return[0] : search.return;
  return (
    <SiteShell>
      <WelcomeView returnTo={raw ?? "/dashboard"} />
    </SiteShell>
  );
}
