import { formatFaNumber } from "../helpers/format-fa-number";

export type MatchNavigatorProps = {
  total: number;
  activeIndex: number;
  matchCase: boolean;
  onMatchCaseChange: (value: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
};

const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M3.5 10.25 8 5.75l4.5 4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M3.5 5.75 8 10.25l4.5-4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function MatchNavigator({
  total,
  activeIndex,
  matchCase,
  onMatchCaseChange,
  onPrevious,
  onNext,
}: MatchNavigatorProps) {
  const canMove = total > 1;
  const label =
    total > 1
      ? `${formatFaNumber(activeIndex + 1)} از ${formatFaNumber(total)} نتیجه`
      : `${formatFaNumber(total)} نتیجه`;

  return (
    <div className="flex items-center gap-2">
      <p aria-live="polite" className="text-xs font-medium text-[#6b7280]">
        {label}
      </p>
      <div className="flex items-center rounded-full bg-[#f5f5f4] p-0.5 text-[#142755]">
        <button
          type="button"
          aria-pressed={matchCase}
          aria-label={matchCase ? "مطابق بزرگی و کوچکی حروف" : "بزرگی و کوچکی حروف مهم نیست"}
          className={`rounded-full px-1.5 py-1 text-[11px] font-semibold leading-none tracking-tight transition ${
            matchCase ? "bg-[#142755] text-white" : "text-[#6b7280] hover:bg-white hover:text-[#142755]"
          }`}
          onClick={() => onMatchCaseChange(!matchCase)}
        >
          <span aria-hidden="true">Aa</span>
        </button>
        <button
          type="button"
          aria-label="نتیجه قبلی"
          disabled={!canMove}
          className="rounded-full p-1 transition hover:bg-white disabled:text-[#d6d3d1] disabled:hover:bg-transparent"
          onClick={onPrevious}
        >
          <ChevronUp />
        </button>
        <button
          type="button"
          aria-label="نتیجه بعدی"
          disabled={!canMove}
          className="rounded-full p-1 transition hover:bg-white disabled:text-[#d6d3d1] disabled:hover:bg-transparent"
          onClick={onNext}
        >
          <ChevronDown />
        </button>
      </div>
    </div>
  );
}
