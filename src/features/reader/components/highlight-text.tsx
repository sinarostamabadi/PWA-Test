import { TextMatch } from "../types/reader.types";

export type HighlightTextProps = {
  text: string;
  matches: TextMatch[];
  activeId: number;
  identify?: boolean;
  onActivate?: (id: number) => void;
};

type Segment = {
  text: string;
  match: TextMatch | null;
};

const splitSegments = (text: string, matches: TextMatch[]): Segment[] => {
  const segments: Segment[] = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (match.start < cursor || match.end > text.length || match.end <= match.start) {
      return;
    }

    if (match.start > cursor) {
      segments.push({ text: text.slice(cursor, match.start), match: null });
    }

    segments.push({ text: text.slice(match.start, match.end), match });
    cursor = match.end;
  });

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), match: null });
  }

  return segments;
};

export default function HighlightText({
  text,
  matches,
  activeId,
  identify = false,
  onActivate,
}: HighlightTextProps) {
  const segments = splitSegments(text, matches);

  return (
    <>
      {segments.map((segment, index) => {
        const match = segment.match;
        if (!match) {
          return <span key={`t-${index}`}>{segment.text}</span>;
        }

        const isActive = match.id === activeId;

        return (
          <mark
            key={`m-${match.id}`}
            id={identify ? `search-hit-${match.id}` : undefined}
            className={`${isActive ? "search-hit search-hit-active" : "search-hit"}${
              onActivate ? " cursor-pointer" : ""
            }`}
            onClick={
              onActivate
                ? (event) => {
                    event.stopPropagation();
                    onActivate(match.id);
                  }
                : undefined
            }
          >
            {segment.text}
          </mark>
        );
      })}
    </>
  );
}
