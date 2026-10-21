import { Snippet } from "../types/reader.types";

const SNIPPET_RADIUS = 36;
const WORD_CHAR = /[A-Za-z0-9\u0600-\u06FF]/;

export const buildSnippet = (
  source: string,
  start: number,
  end: number,
  radius = SNIPPET_RADIUS
): Snippet => {
  let from = Math.max(0, start - radius);
  let to = Math.min(source.length, end + radius);

  while (from > 0 && WORD_CHAR.test(source[from - 1] ?? "")) from -= 1;
  while (to < source.length && WORD_CHAR.test(source[to] ?? "")) to += 1;
  const prefix = from > 0 ? "…" : "";
  const suffix = to < source.length ? "…" : "";
  const body = source.slice(from, to);

  return {
    text: `${prefix}${body}${suffix}`,
    matchStart: prefix.length + (start - from),
    matchEnd: prefix.length + (end - from),
  };
};
