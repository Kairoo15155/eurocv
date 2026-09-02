import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

/** Marketing/dashboard chrome: navbar + footer. The builder uses its own shell. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
