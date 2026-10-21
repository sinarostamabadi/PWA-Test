import { useEffect, useRef } from "react";

import { buildSnippet } from "../helpers/build-snippet";
import { formatFaNumber } from "../helpers/format-fa-number";
import { TextMatch } from "../types/reader.types";
import HighlightText from "./highlight-text";
import MatchNavigator from "./match-navigator";

export type SearchResultsProps = {
  paragraphs: string[];
  matches: TextMatch[];
  activeIndex: number;
  activeId: number;
  matchCase: boolean;
  onMatchCaseChange: (value: boolean) => void;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

export default function SearchResults({
  paragraphs,
  matches,
  activeIndex,
  activeId,
  matchCase,
  onMatchCaseChange,
  onSelect,
  onPrevious,
  onNext,
}: SearchResultsProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>(`[data-result="${activeId}"]`);
    if (!list || !row) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rowRect = row.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    const top =
      list.scrollTop +
      (rowRect.top - listRect.top) -
      list.clientHeight / 2 +
      rowRect.height / 2;

    list.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }, [activeId, matches]);

  return (
    <section className="rounded-2xl border border-[#e7e5e4] bg-white p-3 shadow-[0_1px_2px_rgba(20,39,85,0.04)]">
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <h2 className="text-sm font-semibold">نتایج جستجو</h2>
        <MatchNavigator
          total={matches.length}
          activeIndex={activeIndex}
          matchCase={matchCase}
          onMatchCaseChange={onMatchCaseChange}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </div>

      {matches.length === 0 ? (
        <p className="px-1 py-3 text-sm text-[#6b7280]">
          برای این عبارت نتیجه‌ای در متن پیدا نشد.
        </p>
      ) : (
        <ul
          ref={listRef}
          className="reader-scroll relative max-h-28 space-y-1 overflow-y-auto overscroll-contain sm:max-h-36"
        >
          {matches.map((match, index) => {
            const source = paragraphs[match.paragraphIndex] ?? "";
            const snippet = buildSnippet(source, match.start, match.end);
            const active = match.id === activeId;

            return (
              <li key={match.id}>
                <button
                  type="button"
                  data-result={match.id}
                  className={`flex w-full items-start gap-2 rounded-xl px-3 py-2 text-start text-sm leading-7 transition ${
                    active ? "bg-[#f3f1ec]" : "hover:bg-[#fafaf9]"
                  }`}
                  onClick={() => onSelect(index)}
                >
                  <span className="mt-0.5 min-w-6 text-xs font-medium text-[#a8a29e]">
                    {formatFaNumber(index + 1)}
                  </span>
                  <span>
                    <HighlightText
                      text={snippet.text}
                      matches={[
                        {
                          id: match.id,
                          paragraphIndex: match.paragraphIndex,
                          start: snippet.matchStart,
                          end: snippet.matchEnd,
                        },
                      ]}
                      activeId={active ? match.id : -1}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
