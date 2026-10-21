import { useEffect, useMemo } from "react";

import { TextMatch } from "../types/reader.types";
import HighlightText from "./highlight-text";

export type ReaderDocumentProps = {
  title: string;
  paragraphs: string[];
  matches: TextMatch[];
  activeId: number;
  onActivate: (id: number) => void;
};

const scrollToHit = (activeId: number) => {
  const node = document.getElementById(`search-hit-${activeId}`);
  if (!node) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rect = node.getBoundingClientRect();
  const toolbar = document.querySelector("[data-reader-toolbar]");
  const toolbarBottom = toolbar?.getBoundingClientRect().bottom ?? 0;
  const visibleHeight = Math.max(160, window.innerHeight - toolbarBottom);
  const top =
    window.scrollY + rect.top - toolbarBottom - visibleHeight / 2 + rect.height / 2;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduce ? "auto" : "smooth",
  });
};

export default function ReaderDocument({
  title,
  paragraphs,
  matches,
  activeId,
  onActivate,
}: ReaderDocumentProps) {
  const byParagraph = useMemo(() => {
    const groups = paragraphs.map(() => [] as TextMatch[]);
    matches.forEach((match) => {
      groups[match.paragraphIndex]?.push(match);
    });
    return groups;
  }, [matches, paragraphs]);

  useEffect(() => {
    if (activeId < 0) return;

    const frame = window.requestAnimationFrame(() => scrollToHit(activeId));
    return () => window.cancelAnimationFrame(frame);
  }, [activeId, matches]);

  return (
    <article className="rounded-3xl border border-[#e7e5e4] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(20,39,85,0.04),0_16px_40px_rgba(20,39,85,0.05)] sm:px-8">
      <h2 className="mb-6 border-b border-[#f0eeea] pb-4 text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="space-y-5 text-[15.5px] leading-9 text-[#292524]">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-justify">
            <HighlightText
              text={paragraph}
              matches={byParagraph[index] ?? []}
              activeId={activeId}
              identify
              onActivate={onActivate}
            />
          </p>
        ))}
      </div>
    </article>
  );
}
