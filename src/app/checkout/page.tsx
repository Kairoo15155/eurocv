import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { CheckoutView } from "@/components/pricing/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage(props: PageProps<"/checkout">) {
  const search = await props.searchParams;
  const raw = Array.isArray(search.return) ? search.return[0] : search.return;
  return (
    <SiteShell>
      <CheckoutView returnTo={raw ?? "/dashboard"} />
    </SiteShell>
  );
}
