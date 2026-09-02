import { Container } from "@/components/layout/container";

const steps = [
  {
    number: "01",
    title: "Enter your information",
    text: "Tell us about your education, achievements, projects and experience.",
  },
  {
    number: "02",
    title: "Let AI improve it",
    text: "AI turns your information into professional CV content.",
  },
  {
    number: "03",
    title: "Download your CV",
    text: "Choose a template and download your finished CV as a PDF.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 lg:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-brand uppercase">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">From blank page to finished CV in about ten minutes.</h2>
        </div>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.number} className="relative">
              <div className="flex items-center gap-4">
                <span className="font-serif text-4xl text-brand/70">{s.number}</span>
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.text}</p>
              {i < steps.length - 1 && <span className="sr-only">then</span>}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
