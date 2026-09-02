import { BookOpenCheckIcon, GraduationCapIcon, LayoutTemplateIcon, SparklesIcon } from "lucide-react";
import { Container } from "@/components/layout/container";

const benefits = [
  {
    icon: GraduationCapIcon,
    title: "Built for European university applications",
    text: "Designed around what admissions teams expect from student applicants.",
  },
  {
    icon: SparklesIcon,
    title: "AI-powered writing",
    text: "Turn simple information into professional, concise CV content.",
  },
  {
    icon: LayoutTemplateIcon,
    title: "Professional templates",
    text: "Clean layouts designed for academic applications.",
  },
  {
    icon: BookOpenCheckIcon,
    title: "Made for Georgian students",
    text: "Support for the information Georgian students actually have, including school grades, IELTS, national exams, olympiads and extracurricular activities.",
  },
];

export function Benefits() {
  return (
    <section className="border-y border-border bg-canvas py-20">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything an admissions office wants to see, nothing it doesn’t.</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            EuroCV knows the difference between a job CV and a university application CV.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)]">
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <b.icon className="size-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold leading-snug">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
