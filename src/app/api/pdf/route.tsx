import { z } from "zod";
import { renderToBuffer } from "@react-pdf/renderer";
import { CVPdf } from "@/components/cv/pdf/cv-pdf";
import { registerPdfFonts } from "@/components/cv/pdf/fonts";
import { cvDocumentSchema, templateIdSchema } from "@/lib/cv/schema";
import { cvFileName } from "@/lib/cv/format";
import { errorResponse, parseBody } from "@/lib/api/http";
import { requirePro } from "@/lib/payments/entitlement";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  document: cvDocumentSchema,
  templateId: templateIdSchema,
});

export async function POST(request: Request) {
  const gate = requirePro(request);
  if (gate) return gate;
  const body = await parseBody(request, bodySchema);
  if (!body.ok) return body.response;

  const { document, templateId } = body.data;
  // Element is created outside try/catch; react-pdf renders it inside renderToBuffer.
  const element = <CVPdf document={document} templateId={templateId} />;
  try {
    registerPdfFonts();
    const buffer = await renderToBuffer(element);
    const [first = "", ...rest] = document.header.fullName.split(" ");
    const filename = cvFileName(first, rest.join(" "));
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[eurocv] PDF render failed", error instanceof Error ? error.message : error);
    return errorResponse("We couldn't create your PDF right now. Please try again.", 500);
  }
}
