import { SearchSuggestion } from "../types/reader.types";

export type SuggestionListProps = {
  suggestions: SearchSuggestion[];
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (label: string) => void;
};

export default function SuggestionList({
  suggestions,
  activeIndex,
  onHover,
  onSelect,
}: SuggestionListProps) {
  if (!suggestions.length) return null;

  return (
    <ul
      id="reader-suggestions"
      role="listbox"
      className="absolute inset-x-0 top-[calc(100%+0.4rem)] z-20 overflow-hidden rounded-2xl border border-[#e7e5e4] bg-white py-1 shadow-[0_12px_32px_rgba(20,39,85,0.08)]"
    >
      {suggestions.map((suggestion, index) => {
        const active = index === activeIndex;

        return (
          <li key={suggestion.id} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={active}
              className={`w-full px-4 py-2.5 text-start text-sm transition ${
                active ? "bg-[#f4f6fb] text-[#142755]" : "text-[#1f2937]"
              }`}
              onMouseEnter={() => onHover(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(suggestion.label)}
            >
              {suggestion.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
