import { useEffect } from "react";

import { SAMPLE_DOCUMENT } from "../constants/sample-document";
import { useInstallPrompt } from "../hooks/use-install-prompt";
import { useOnlineStatus } from "../hooks/use-online-status";
import { useReaderSearch } from "../hooks/use-reader-search";
import ReaderDocument from "./reader-document";
import SearchBar from "./search-bar";
import SearchResults from "./search-results";

export default function ReaderPage() {
  const online = useOnlineStatus();
  const { canInstall, installed, install } = useInstallPrompt();
  const {
    query,
    setQuery,
    matchCase,
    setMatchCase,
    matches,
    suggestions,
    activeIndex,
    activeId,
    setActiveIndex,
    goNext,
    goPrevious,
  } = useReaderSearch();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        goPrevious();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrevious]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-[#142755]">
      <header
        data-reader-toolbar
        className="sticky top-0 z-30 border-b border-[#e7e5e4] bg-[#f6f5f2]"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3.5">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-[17px] font-semibold tracking-tight">
              Smart Search Reader
            </h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#6b7280]">
                <span
                  className={`size-1.5 rounded-full ${
                    online ? "bg-emerald-500" : "bg-[#ff2d55]"
                  }`}
                />
                {online ? "آنلاین" : "آفلاین"}
              </span>
              {canInstall ? (
                <button
                  type="button"
                  className="rounded-full bg-[#142755] px-3 py-1.5 text-xs font-medium text-white"
                  onClick={() => {
                    void install();
                  }}
                >
                  نصب
                </button>
              ) : null}
              {installed ? (
                <span className="text-xs text-[#6b7280]">نصب شده</span>
              ) : null}
            </div>
          </div>
          <SearchBar
            query={query}
            suggestions={suggestions}
            onQueryChange={setQuery}
            onSelectSuggestion={setQuery}
            onNextMatch={goNext}
            onPreviousMatch={goPrevious}
          />
          {hasQuery ? (
            <SearchResults
              paragraphs={SAMPLE_DOCUMENT.paragraphs}
              matches={matches}
              activeIndex={activeIndex}
              activeId={activeId}
              matchCase={matchCase}
              onMatchCaseChange={setMatchCase}
              onSelect={setActiveIndex}
              onPrevious={goPrevious}
              onNext={goNext}
            />
          ) : null}
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
        <ReaderDocument
          title={SAMPLE_DOCUMENT.title}
          paragraphs={SAMPLE_DOCUMENT.paragraphs}
          matches={hasQuery ? matches : []}
          activeId={hasQuery ? activeId : -1}
          onActivate={setActiveIndex}
        />
      </main>
    </div>
  );
}
