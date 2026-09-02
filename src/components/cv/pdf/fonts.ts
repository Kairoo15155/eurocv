import path from "node:path";
import { Font } from "@react-pdf/renderer";

let registered = false;

/**
 * Registers the bundled Inter and Source Serif 4 faces with react-pdf.
 * Files live in public/fonts and are included in the server bundle via
 * `outputFileTracingIncludes` in next.config.ts.
 */
export function registerPdfFonts(): void {
  if (registered) return;
  const dir = path.join(process.cwd(), "public", "fonts");
  const file = (name: string) => path.join(dir, name);

  Font.register({
    family: "Inter",
    fonts: [
      { src: file("Inter-400.ttf"), fontWeight: 400 },
      { src: file("Inter-500.ttf"), fontWeight: 500 },
      { src: file("Inter-600.ttf"), fontWeight: 600 },
      { src: file("Inter-700.ttf"), fontWeight: 700 },
    ],
  });
  Font.register({
    family: "Source Serif 4",
    fonts: [
      { src: file("SourceSerif4-400.ttf"), fontWeight: 400 },
      { src: file("SourceSerif4-400-italic.ttf"), fontWeight: 400, fontStyle: "italic" },
      { src: file("SourceSerif4-600.ttf"), fontWeight: 600 },
      { src: file("SourceSerif4-700.ttf"), fontWeight: 700 },
    ],
  });
  // Never hyphenate: keeps names, links and technical terms intact.
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}
