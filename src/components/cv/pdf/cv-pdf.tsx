import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CVDocument, TemplateId } from "@/lib/cv/types";
import { TEMPLATE_CONFIGS, type SectionKey, type TemplateConfig } from "@/lib/cv/templates";

/**
 * PDF rendering of a CV. Mirrors `CVTemplate` (HTML) section by section.
 * A4 with 42pt/45pt margins; text wraps across pages and small entries are
 * kept together so lines are never cut mid-entry.
 */

const GREY = "#4b5563";
const LIGHT = "#6b7280";
const TEXT = "#1a1a1a";

function fontFamily(config: TemplateConfig) {
  return config.font === "serif" ? "Source Serif 4" : "Inter";
}

export function CVPdf({ document: doc, templateId }: { document: CVDocument; templateId: TemplateId }) {
  const config = TEMPLATE_CONFIGS[templateId];
  const styles = makeStyles(config);
  const title = `${doc.header.fullName || "CV"} — EuroCV`;

  return (
    <Document title={title} author={doc.header.fullName} creator="EuroCV" producer="EuroCV">
      <Page size="A4" style={styles.page}>
        <Header doc={doc} styles={styles} />
        {config.sectionOrder.map((key) => (
          <Section key={key} sectionKey={key} doc={doc} config={config} styles={styles} />
        ))}
      </Page>
    </Document>
  );
}

type Styles = ReturnType<typeof makeStyles>;

function makeStyles(config: TemplateConfig) {
  const serif = config.font === "serif";
  return StyleSheet.create({
    page: {
      fontFamily: fontFamily(config),
      fontSize: 10,
      lineHeight: 1.45,
      color: TEXT,
      paddingTop: 42,
      paddingBottom: 48,
      paddingHorizontal: 45,
    },
    header: {
      marginBottom: 14,
      alignItems: config.headerAlign === "center" ? "center" : "flex-start",
      ...(config.id === "modern"
        ? { borderBottomWidth: 1.5, borderBottomColor: config.accent, paddingBottom: 10 }
        : config.id === "academic"
          ? { borderBottomWidth: 0.75, borderBottomColor: TEXT, paddingBottom: 9 }
          : {}),
    },
    name: {
      fontSize: serif ? 21 : 19.5,
      fontWeight: 700,
      color: config.id === "modern" ? config.accent : "#111111",
      lineHeight: 1.15,
      textAlign: config.headerAlign,
    },
    headline: {
      marginTop: 3,
      fontSize: 10,
      color: serif ? "#3a3a3a" : GREY,
      fontStyle: serif ? "italic" : "normal",
      fontWeight: serif ? 400 : 500,
      textAlign: config.headerAlign,
    },
    contactRow: {
      marginTop: 5,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: config.headerAlign === "center" ? "center" : "flex-start",
      columnGap: 0,
      rowGap: 1,
    },
    contact: { fontSize: 8.6, color: GREY },
    contactSep: { fontSize: 8.6, color: "#9ca3af", marginHorizontal: 5 },
    section: { marginBottom: 12 },
    heading:
      config.headingStyle === "caps-accent"
        ? {
            fontSize: 8,
            fontWeight: 600,
            textTransform: "uppercase" as const,
            letterSpacing: 1.1,
            color: config.accent,
            borderBottomWidth: 0.75,
            borderBottomColor: "#d1d5db",
            paddingBottom: 3,
            marginBottom: 6,
          }
        : config.headingStyle === "bold-rule"
          ? {
              fontSize: 9.5,
              fontWeight: 700,
              borderBottomWidth: 0.75,
              borderBottomColor: TEXT,
              paddingBottom: 2,
              marginBottom: 6,
            }
          : {
              fontSize: 8.4,
              fontWeight: 600,
              textTransform: "uppercase" as const,
              letterSpacing: 1,
              borderBottomWidth: 0.75,
              borderBottomColor: TEXT,
              paddingBottom: 3,
              marginBottom: 6,
            },
    paragraph: { fontSize: 10, lineHeight: 1.5 },
    entry: { marginBottom: 7 },
    entryCompact: { marginBottom: 5 },
    entryRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
    entryMain: { flexGrow: 1, flexShrink: 1 },
    entryTitle: { fontSize: 10, fontWeight: 600, lineHeight: 1.3 },
    entrySubtitle: { fontSize: 9.5, color: "#374151" },
    entryMeta: { fontSize: 8.6, color: LIGHT },
    entryDates: { fontSize: 9, color: GREY, flexShrink: 0 },
    inlineDates: { fontWeight: 400, color: GREY },
    bullets: { marginTop: 2, paddingLeft: 10 },
    bulletRow: { flexDirection: "row", marginBottom: 1 },
    bulletDot: { width: 8, fontSize: 9.5 },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.45 },
    bold: { fontWeight: 600 },
  });
}

function Header({ doc, styles }: { doc: CVDocument; styles: Styles }) {
  const h = doc.header;
  const contact = [h.email, h.phone, h.location, h.linkedin, h.website].filter(Boolean);
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{h.fullName || "Your Name"}</Text>
      {h.headline ? <Text style={styles.headline}>{h.headline}</Text> : null}
      {contact.length > 0 ? (
        <View style={styles.contactRow}>
          {contact.map((c, i) => (
            <View key={i} style={{ flexDirection: "row" }}>
              {i > 0 ? <Text style={styles.contactSep}>·</Text> : null}
              <Text style={styles.contact}>{c}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function Section({
  sectionKey,
  doc,
  config,
  styles,
}: {
  sectionKey: SectionKey;
  doc: CVDocument;
  config: TemplateConfig;
  styles: Styles;
}) {
  const body = renderSection(sectionKey, doc, config, styles);
  if (!body) return null;
  const blocks = Array.isArray(body) ? body : [body];
  const [first, ...rest] = blocks;
  // The heading travels with the first block so it is never orphaned at a page end.
  return (
    <View style={styles.section}>
      <View wrap={false}>
        <Text style={styles.heading}>{config.labels[sectionKey]}</Text>
        {first}
      </View>
      {rest}
    </View>
  );
}

function renderSection(key: SectionKey, doc: CVDocument, config: TemplateConfig, styles: Styles) {
  switch (key) {
    case "summary":
      return doc.summary ? <Text style={styles.paragraph}>{doc.summary}</Text> : null;
    case "education":
      return doc.education.length
        ? doc.education.map((e, i) => (
            <Entry
              key={i}
              config={config}
              styles={styles}
              title={e.institution}
              subtitle={[e.degree, e.gpa ? `GPA: ${e.gpa}` : ""].filter(Boolean).join(" · ")}
              meta={e.location}
              dates={e.dates}
              bullets={e.details}
            />
          ))
        : null;
    case "experience":
      return doc.experience.length
        ? doc.experience.map((x, i) => (
            <Entry
              key={i}
              config={config}
              styles={styles}
              title={x.position}
              subtitle={[x.organization, x.type && x.type !== "Work" ? x.type : ""].filter(Boolean).join(" · ")}
              meta={x.location}
              dates={x.dates}
              bullets={x.bullets}
            />
          ))
        : null;
    case "projects":
      return doc.projects.length
        ? doc.projects.map((p, i) => (
            <Entry
              key={i}
              config={config}
              styles={styles}
              title={p.name}
              subtitle={p.technologies}
              meta={p.link}
              dates={p.date}
              bullets={p.bullets}
            />
          ))
        : null;
    case "achievements":
      return doc.achievements.length
        ? doc.achievements.map((a, i) => (
            <Entry
              key={i}
              config={config}
              styles={styles}
              title={a.title}
              subtitle={a.issuer}
              dates={a.date}
              bullets={a.description ? [a.description] : []}
              compact
            />
          ))
        : null;
    case "activities":
      return doc.activities.length
        ? doc.activities.map((a, i) => (
            <Entry
              key={i}
              config={config}
              styles={styles}
              title={a.title}
              subtitle={a.organization}
              dates={a.dates}
              bullets={a.description ? [a.description] : []}
              compact
            />
          ))
        : null;
    case "skills": {
      const rows: [string, string[]][] = [
        ["Technical", doc.skills.technical],
        ["Soft skills", doc.skills.soft],
      ];
      const visible = rows.filter(([, list]) => list.length > 0);
      return visible.length
        ? visible.map(([label, list]) => (
            <Text key={label} style={styles.paragraph}>
              <Text style={styles.bold}>{label}: </Text>
              {list.join(", ")}
            </Text>
          ))
        : null;
    }
    case "languages": {
      if (!doc.languages.length && !doc.certifications.length) return null;
      return (
        <View>
          {doc.languages.length > 0 ? (
            <Text style={styles.paragraph}>
              {doc.languages.map((l, i) => (
                <Text key={i}>
                  {i > 0 ? ", " : ""}
                  <Text style={styles.bold}>{l.language}</Text> — {l.level}
                </Text>
              ))}
            </Text>
          ) : null}
          {doc.certifications.length > 0 ? (
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Test scores: </Text>
              {doc.certifications.join(", ")}
            </Text>
          ) : null}
        </View>
      );
    }
  }
}

function Entry({
  config,
  styles,
  title,
  subtitle,
  meta,
  dates,
  bullets,
  compact,
}: {
  config: TemplateConfig;
  styles: Styles;
  title: string;
  subtitle?: string;
  meta?: string;
  dates?: string;
  bullets: string[];
  compact?: boolean;
}) {
  const right = config.datesPosition === "right";
  // Keep short entries on one page; long ones may wrap naturally.
  const keepTogether = bullets.join(" ").length < 400;
  return (
    <View style={compact ? styles.entryCompact : styles.entry} wrap={!keepTogether}>
      <View style={styles.entryRow}>
        <View style={styles.entryMain}>
          <Text style={styles.entryTitle}>
            {title}
            {!right && dates ? <Text style={styles.inlineDates}> · {dates}</Text> : null}
          </Text>
          {subtitle ? <Text style={styles.entrySubtitle}>{subtitle}</Text> : null}
          {meta ? <Text style={styles.entryMeta}>{meta}</Text> : null}
        </View>
        {right && dates ? <Text style={styles.entryDates}>{dates}</Text> : null}
      </View>
      {bullets.length > 0 ? (
        <View style={styles.bullets}>
          {bullets.map((b, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
