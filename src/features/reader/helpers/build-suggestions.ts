import { IndexedWord, SearchSuggestion } from "../types/reader.types";
import { normalizeQuery } from "./normalize-search-text";

const WORD_PATTERN = /[A-Za-z0-9\u0600-\u06FF]+/g;
export const SUGGESTION_LIMIT = 6;

export const collectWords = (text: string, matchCase = false): IndexedWord[] => {
  const seen = new Set<string>();
  const words: IndexedWord[] = [];

  for (const match of text.matchAll(WORD_PATTERN)) {
    const label = match[0];
    const normalized = normalizeQuery(label, matchCase);
    if (!normalized || seen.has(normalized)) continue;

    seen.add(normalized);
    words.push({ label, normalized });
  }

  return words;
};

const byCloserWord = (left: IndexedWord, right: IndexedWord) =>
  left.normalized.length - right.normalized.length ||
  left.label.localeCompare(right.label, "fa");

export const buildSuggestions = (
  words: IndexedWord[],
  query: string,
  limit = SUGGESTION_LIMIT,
  matchCase = false
): SearchSuggestion[] => {
  const needle = normalizeQuery(query, matchCase);
  if (!needle) return [];

  const prefix: IndexedWord[] = [];
  const contains: IndexedWord[] = [];

  words.forEach((word) => {
    if (word.normalized === needle) return;
    if (word.normalized.startsWith(needle)) prefix.push(word);
    else if (word.normalized.includes(needle)) contains.push(word);
  });

  const ranked = (prefix.length > 0 ? prefix : contains).sort(byCloserWord);

  return ranked.slice(0, limit).map((word) => ({
    id: word.normalized,
    label: word.label,
  }));
};
