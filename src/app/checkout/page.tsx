import type { Metadata } from "next";
import { headers } from "next/headers";
import { SiteShell } from "@/components/layout/site-shell";
import { CheckoutView } from "@/components/pricing/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage(props: PageProps<"/checkout">) {
  const search = await props.searchParams;
  const raw = Array.isArray(search.return) ? search.return[0] : search.return;
  const country = (await headers()).get("x-vercel-ip-country");
  const countryCode = country && /^[A-Z]{2}$/.test(country) ? country : undefined;
  return (
    <SiteShell>
      <CheckoutView returnTo={raw ?? "/dashboard"} countryCode={countryCode} />
    </SiteShell>
  );
}
