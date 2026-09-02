"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { CVTemplate } from "@/components/cv/cv-template";
import type { CVDocument, TemplateId } from "@/lib/cv/types";
import { cn } from "@/lib/utils";

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

/**
 * Renders the A4 CV at its natural size and scales it to fit the container
 * width, so the document looks identical at every viewport.
 */
export function CVPaper({
  document,
  templateId,
  className,
  maxScale = 1,
  shadow = true,
}: {
  document: CVDocument;
  templateId: TemplateId;
  className?: string;
  maxScale?: number;
  shadow?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [height, setHeight] = useState(PAGE_HEIGHT);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const page = pageRef.current;
    if (!container || !page) return;

    const update = () => {
      const width = container.clientWidth;
      const next = Math.min(maxScale, width / PAGE_WIDTH);
      setScale(next);
      setHeight(Math.max(PAGE_HEIGHT, page.scrollHeight));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(page);
    return () => observer.disconnect();
  }, [maxScale]);

  return (
    <div ref={containerRef} className={cn("w-full min-w-0", className)}>
      <div
        style={{ height: height * scale, width: PAGE_WIDTH * scale, maxWidth: "100%", opacity: scale ? 1 : 0 }}
        className="relative mx-auto transition-opacity duration-300"
      >
        <div
          ref={pageRef}
          className={cn(
            "absolute top-0 left-0 origin-top-left rounded-[2px] bg-white",
            shadow && "shadow-[0_1px_2px_rgba(15,23,42,0.06),0_12px_40px_-12px_rgba(15,23,42,0.25)] ring-1 ring-black/5",
          )}
          style={{ transform: `scale(${scale})`, width: PAGE_WIDTH }}
        >
          <CVTemplate document={document} templateId={templateId} />
          <PageGuides height={height} />
        </div>
      </div>
    </div>
  );
}

/** Faint markers where A4 page breaks will fall in the PDF. */
function PageGuides({ height }: { height: number }) {
  const breaks = Math.floor((height - 1) / PAGE_HEIGHT);
  if (breaks < 1) return null;
  return (
    <>
      {Array.from({ length: breaks }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute right-0 left-0 border-t border-dashed border-slate-300"
          style={{ top: PAGE_HEIGHT * (i + 1) }}
        >
          <span className="absolute -top-2.5 right-3 rounded bg-slate-100 px-1.5 text-[10px] text-slate-500">
            Page {i + 2}
          </span>
        </div>
      ))}
    </>
  );
}
