import { PreparedParagraph, TextMatch } from "../types/reader.types";
import { normalizeQuery } from "./normalize-search-text";

export const findDocumentMatches = (
  paragraphs: PreparedParagraph[],
  query: string,
  matchCase = false
): TextMatch[] => {
  const needle = normalizeQuery(query, matchCase);
  if (!needle) return [];

  const matches: TextMatch[] = [];

  paragraphs.forEach((paragraph, paragraphIndex) => {
    let from = 0;

    while (from <= paragraph.normalized.length - needle.length) {
      const at = paragraph.normalized.indexOf(needle, from);
      if (at < 0) break;

      matches.push({
        id: matches.length,
        paragraphIndex,
        start: paragraph.toRaw[at],
        end: paragraph.toRaw[at + needle.length - 1] + 1,
      });

      from = at + needle.length;
    }
  });

  return matches;
};
