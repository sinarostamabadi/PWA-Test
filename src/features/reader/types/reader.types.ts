export type ReaderDocument = {
  paragraphs: string[];
};

export type PreparedText = {
  normalized: string;
  toRaw: number[];
};

export type PreparedParagraph = PreparedText & {
  text: string;
};

export type TextMatch = {
  id: number;
  paragraphIndex: number;
  start: number;
  end: number;
};

export type IndexedWord = {
  label: string;
  normalized: string;
};

export type SearchSuggestion = {
  id: string;
  label: string;
};

export type Snippet = {
  text: string;
  matchStart: number;
  matchEnd: number;
};
