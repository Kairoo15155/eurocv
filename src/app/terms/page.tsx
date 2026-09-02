import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms that apply when you use EuroCV to build a CV for university applications.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated="2 September 2026">
      <section>
        <h2>The service</h2>
        <p>
          EuroCV helps students prepare a CV for university applications by formatting the information they provide and
          rewriting it with AI assistance. EuroCV is an independent product. It is not affiliated with, endorsed by, or
          acting on behalf of any university, admissions body or European Union institution.
        </p>
      </section>
      <section>
        <h2>Your responsibilities</h2>
        <ul>
          <li>Only submit information that is true and that you have the right to provide.</li>
          <li>Review every AI-generated sentence before you submit a CV anywhere. You are responsible for its accuracy.</li>
          <li>Do not use EuroCV to misrepresent your qualifications, grades, experience or achievements.</li>
        </ul>
      </section>
      <section>
        <h2>AI-generated content</h2>
        <p>
          The AI is instructed to use only the information you enter and never to invent achievements, qualifications,
          experience, skills, languages or results. AI systems can still make mistakes, including grammatical or factual
          ones. Treat the output as a draft that you check and own.
        </p>
      </section>
      <section>
        <h2>No guarantee of admission</h2>
        <p>
          A CV is one part of an application. EuroCV does not guarantee, and cannot influence, any admission decision,
          scholarship, visa or other outcome.
        </p>
      </section>
      <section>
        <h2>Payments</h2>
        <p>
          EuroCV Pro is offered as a one-time purchase. While payments are in preview mode no charge is made and Pro
          features are unlocked for evaluation in your browser. When live payments launch, refund terms will be published
          on the pricing page before purchase.
        </p>
      </section>
      <section>
        <h2>Availability and changes</h2>
        <p>
          We may change or discontinue features, templates or pricing. Because your CVs are stored in your browser, we
          recommend downloading a PDF of anything you want to keep.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Questions about these terms: {SITE.supportEmail}.</p>
      </section>
    </LegalPage>
  );
}
