import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How EuroCV handles the information you enter while building your CV.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="2 September 2026">
      <section>
        <h2>What this covers</h2>
        <p>
          This policy explains what happens to the information you enter into EuroCV. It is written for the current
          version of the product, which does not have user accounts. We will update it before adding accounts, payments
          or any other feature that changes how data is handled.
        </p>
      </section>
      <section>
        <h2>Information you provide</h2>
        <p>
          To build a CV you enter personal details (name, contact information), education, languages, projects,
          experience, achievements, activities, skills and your application target. You should only submit information
          you have the right to provide and that is accurate.
        </p>
      </section>
      <section>
        <h2>Where it is stored</h2>
        <ul>
          <li>Your CVs are saved in your own browser’s local storage. They are not stored on EuroCV servers.</li>
          <li>Clearing your browser data or using a different device means the CVs will not be there.</li>
          <li>Your Pro status (in preview mode) is also stored locally in your browser.</li>
        </ul>
      </section>
      <section>
        <h2>AI processing</h2>
        <p>
          When you generate, review or improve a CV, the information you entered is sent to our server and then to
          Google’s Gemini API to produce the written content. This is necessary for the feature to work. We use the
          Gemini API free tier, and Google may use content sent through it to improve its products; we do not sell
          your information. AI output is generated from your input only; it is
          instructed never to invent achievements, qualifications or experience, but you must review all content before
          using it.
        </p>
      </section>
      <section>
        <h2>PDF generation</h2>
        <p>
          PDFs are rendered on our server from the CV content in your browser and returned to you immediately. They are
          not kept after the download completes.
        </p>
      </section>
      <section>
        <h2>Cookies and analytics</h2>
        <p>EuroCV currently sets no tracking cookies and runs no third-party analytics.</p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>
          You can delete any CV from the dashboard at any time, which removes it from your browser. Because nothing is
          stored on our servers, there is no server-side data to request or erase.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Questions about privacy: {SITE.supportEmail}.</p>
      </section>
    </LegalPage>
  );
}
