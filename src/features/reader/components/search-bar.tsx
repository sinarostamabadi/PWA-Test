import { KeyboardEvent, useEffect, useRef, useState } from "react";

import { SearchSuggestion } from "../types/reader.types";
import SuggestionList from "./suggestion-list";

export type SearchBarProps = {
  query: string;
  suggestions: SearchSuggestion[];
  onQueryChange: (value: string) => void;
  onSelectSuggestion: (label: string) => void;
  onNextMatch: () => void;
  onPreviousMatch: () => void;
};

export default function SearchBar({
  query,
  suggestions,
  onQueryChange,
  onSelectSuggestion,
  onNextMatch,
  onPreviousMatch,
}: SearchBarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);

  useEffect(() => {
    setSuggestionIndex(-1);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const selectSuggestion = (label: string) => {
    onSelectSuggestion(label);
    setOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (open && suggestions.length > 0 && event.key === "ArrowDown") {
      event.preventDefault();
      setSuggestionIndex((current) =>
        current + 1 >= suggestions.length ? 0 : current + 1
      );
      return;
    }

    if (open && suggestions.length > 0 && event.key === "ArrowUp") {
      event.preventDefault();
      setSuggestionIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const picked = suggestions[suggestionIndex];
      if (open && picked) {
        selectSuggestion(picked.label);
        return;
      }
      onNextMatch();
      return;
    }

    if (!open && event.key === "ArrowDown") {
      event.preventDefault();
      onNextMatch();
    }

    if (!open && event.key === "ArrowUp") {
      event.preventDefault();
      onPreviousMatch();
    }
  };

  return (
    <div ref={rootRef}>
      <label htmlFor="reader-search" className="mb-2 block text-xs font-medium text-[#6b7280]">
        جستجوی کلمه
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 12.25 15.25 15.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <input
          id="reader-search"
          type="text"
          value={query}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls="reader-suggestions"
          aria-autocomplete="list"
          placeholder="کلمه یا عبارت را بنویسید"
          className="w-full rounded-2xl border border-[#e7e5e4] bg-white py-3.5 ps-11 pe-11 text-base text-[#142755] shadow-[0_1px_2px_rgba(20,39,85,0.04)] outline-none transition placeholder:text-[#a8a29e] focus:border-[#365cb8] focus:shadow-[0_0_0_4px_rgba(54,92,184,0.12)]"
          onChange={(event) => {
            onQueryChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
        {query ? (
          <button
            type="button"
            aria-label="پاک کردن"
            className="absolute end-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f5f5f4] hover:text-[#142755]"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onQueryChange("")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 3.5 11 11.5M11 3.5 3 11.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
        {open ? (
          <SuggestionList
            suggestions={suggestions}
            activeIndex={suggestionIndex}
            onHover={setSuggestionIndex}
            onSelect={selectSuggestion}
          />
        ) : null}
      </div>
    </div>
  );
}
