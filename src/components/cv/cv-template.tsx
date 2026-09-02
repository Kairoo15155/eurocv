import type { CVDocument, TemplateId } from "@/lib/cv/types";
import { TEMPLATE_CONFIGS, type SectionKey, type TemplateConfig } from "@/lib/cv/templates";
import { cn } from "@/lib/utils";

/**
 * HTML rendering of a CV at A4 proportions (794px wide). Used for the live
 * preview and the example page. Styling mirrors the PDF renderer.
 */
export function CVTemplate({
  document: doc,
  templateId,
  className,
}: {
  document: CVDocument;
  templateId: TemplateId;
  className?: string;
}) {
  const config = TEMPLATE_CONFIGS[templateId];
  const fontClass = config.font === "serif" ? "font-serif" : "font-sans";

  return (
    <article
      data-template={templateId}
      className={cn(
        "cv-page bg-white text-[#1a1a1a] antialiased",
        fontClass,
        className,
      )}
      style={{ width: 794, minHeight: 1123, padding: "56px 60px", fontSize: 13, lineHeight: 1.45 }}
    >
      <Header doc={doc} config={config} />
      {config.sectionOrder.map((key) => (
        <Section key={key} sectionKey={key} doc={doc} config={config} />
      ))}
    </article>
  );
}

function Header({ doc, config }: { doc: CVDocument; config: TemplateConfig }) {
  const h = doc.header;
  const contact = [h.email, h.phone, h.location, h.linkedin, h.website].filter(Boolean);
  const centered = config.headerAlign === "center";
  return (
    <header
      className={cn("mb-5", centered ? "text-center" : "text-left")}
      style={
        config.id === "modern"
          ? { borderBottom: `2px solid ${config.accent}`, paddingBottom: 14 }
          : config.id === "academic"
            ? { borderBottom: "1px solid #1a1a1a", paddingBottom: 12 }
            : undefined
      }
    >
      <h1
        className={cn("font-bold tracking-tight", config.font === "serif" ? "text-[28px]" : "text-[26px]")}
        style={{ color: config.id === "modern" ? config.accent : "#111", lineHeight: 1.15 }}
      >
        {h.fullName || "Your Name"}
      </h1>
      {h.headline && (
        <p className={cn("mt-1 text-[13px]", config.font === "sans" ? "text-[#4b5563] font-medium" : "italic text-[#3a3a3a]")}>
          {h.headline}
        </p>
      )}
      {contact.length > 0 && (
        <p className={cn("mt-2 text-[11.5px] text-[#4b5563]", centered ? "" : "")}>
          {contact.map((c, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-1.5 text-[#9ca3af]">·</span>}
              {c}
            </span>
          ))}
        </p>
      )}
    </header>
  );
}

function SectionHeading({ label, config }: { label: string; config: TemplateConfig }) {
  if (config.headingStyle === "caps-accent") {
    return (
      <h2
        className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: config.accent, borderBottom: "1px solid #d1d5db", paddingBottom: 4 }}
      >
        {label}
      </h2>
    );
  }
  if (config.headingStyle === "bold-rule") {
    return (
      <h2
        className="mb-2 text-[12.5px] font-bold"
        style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: 3 }}
      >
        {label}
      </h2>
    );
  }
  return (
    <h2
      className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]"
      style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: 4 }}
    >
      {label}
    </h2>
  );
}

function Section({ sectionKey, doc, config }: { sectionKey: SectionKey; doc: CVDocument; config: TemplateConfig }) {
  const body = renderSection(sectionKey, doc, config);
  if (!body) return null;
  return (
    <section className="mb-5">
      <SectionHeading label={config.labels[sectionKey]} config={config} />
      {body}
    </section>
  );
}

function renderSection(key: SectionKey, doc: CVDocument, config: TemplateConfig) {
  switch (key) {
    case "summary":
      return doc.summary ? <p className="text-[13px] leading-[1.5]">{doc.summary}</p> : null;
    case "education":
      return doc.education.length ? (
        <div className="space-y-3">
          {doc.education.map((e, i) => (
            <Entry
              key={i}
              config={config}
              title={e.institution}
              subtitle={[e.degree, e.gpa ? `GPA: ${e.gpa}` : ""].filter(Boolean).join(" · ")}
              meta={e.location}
              dates={e.dates}
              bullets={e.details}
            />
          ))}
        </div>
      ) : null;
    case "experience":
      return doc.experience.length ? (
        <div className="space-y-3">
          {doc.experience.map((x, i) => (
            <Entry
              key={i}
              config={config}
              title={x.position}
              subtitle={[x.organization, x.type && x.type !== "Work" ? x.type : ""].filter(Boolean).join(" · ")}
              meta={x.location}
              dates={x.dates}
              bullets={x.bullets}
            />
          ))}
        </div>
      ) : null;
    case "projects":
      return doc.projects.length ? (
        <div className="space-y-3">
          {doc.projects.map((p, i) => (
            <Entry
              key={i}
              config={config}
              title={p.name}
              subtitle={p.technologies}
              meta={p.link}
              dates={p.date}
              bullets={p.bullets}
            />
          ))}
        </div>
      ) : null;
    case "achievements":
      return doc.achievements.length ? (
        <div className="space-y-2">
          {doc.achievements.map((a, i) => (
            <Entry
              key={i}
              config={config}
              title={a.title}
              subtitle={a.issuer}
              dates={a.date}
              bullets={a.description ? [a.description] : []}
              compact
            />
          ))}
        </div>
      ) : null;
    case "activities":
      return doc.activities.length ? (
        <div className="space-y-2">
          {doc.activities.map((a, i) => (
            <Entry
              key={i}
              config={config}
              title={a.title}
              subtitle={a.organization}
              dates={a.dates}
              bullets={a.description ? [a.description] : []}
              compact
            />
          ))}
        </div>
      ) : null;
    case "skills": {
      const rows = [
        ["Technical", doc.skills.technical],
        ["Soft skills", doc.skills.soft],
      ].filter(([, list]) => (list as string[]).length > 0) as [string, string[]][];
      return rows.length ? (
        <div className="space-y-1 text-[13px]">
          {rows.map(([label, list]) => (
            <p key={label}>
              <span className="font-semibold">{label}: </span>
              {list.join(", ")}
            </p>
          ))}
        </div>
      ) : null;
    }
    case "languages": {
      if (!doc.languages.length && !doc.certifications.length) return null;
      return (
        <div className="space-y-1 text-[13px]">
          {doc.languages.length > 0 && (
            <p>
              {doc.languages.map((l, i) => (
                <span key={i}>
                  {i > 0 && ", "}
                  <span className="font-semibold">{l.language}</span> — {l.level}
                </span>
              ))}
            </p>
          )}
          {doc.certifications.length > 0 && (
            <p>
              <span className="font-semibold">Test scores: </span>
              {doc.certifications.join(", ")}
            </p>
          )}
        </div>
      );
    }
  }
}

function Entry({
  config,
  title,
  subtitle,
  meta,
  dates,
  bullets,
  compact,
}: {
  config: TemplateConfig;
  title: string;
  subtitle?: string;
  meta?: string;
  dates?: string;
  bullets: string[];
  compact?: boolean;
}) {
  const right = config.datesPosition === "right";
  return (
    <div>
      <div className={cn("flex gap-4", right ? "justify-between" : "flex-col")}>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold leading-snug">
            {title}
            {!right && dates && (
              <span className="font-normal text-[#4b5563]"> · {dates}</span>
            )}
          </p>
          {subtitle && <p className="text-[12.5px] text-[#374151]">{subtitle}</p>}
          {meta && <p className="text-[11.5px] text-[#6b7280]">{meta}</p>}
        </div>
        {right && dates && (
          <p className="shrink-0 text-[12px] text-[#4b5563] whitespace-nowrap">{dates}</p>
        )}
      </div>
      {bullets.length > 0 && (
        <ul className={cn("mt-1 space-y-0.5 pl-4 text-[12.5px]", compact && "mt-0.5")} style={{ listStyleType: "disc" }}>
          {bullets.map((b, i) => (
            <li key={i} className="leading-[1.45]">
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
