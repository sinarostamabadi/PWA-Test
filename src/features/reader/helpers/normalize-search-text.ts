import { PreparedParagraph, PreparedText } from "../types/reader.types";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

const CHAR_FOLDS: Record<string, string> = {
  ي: "ی",
  ى: "ی",
  ك: "ک",
  ة: "ه",
  ۀ: "ه",
  أ: "ا",
  إ: "ا",
  آ: "ا",
  ٱ: "ا",
  ؤ: "و",
  ئ: "ی",
};

const isSkipped = (char: string) =>
  char === "\u200c" ||
  char === "\u200d" ||
  char === "\u0640" ||
  /[\u064B-\u0652\u0670]/.test(char);

const foldChar = (char: string, matchCase: boolean) => {
  const persianDigit = PERSIAN_DIGITS.indexOf(char);
  if (persianDigit >= 0) return String(persianDigit);

  const arabicDigit = ARABIC_DIGITS.indexOf(char);
  if (arabicDigit >= 0) return String(arabicDigit);

  const folded = CHAR_FOLDS[char] ?? char;
  return matchCase ? folded : folded.toLowerCase();
};

export const normalizeWithMap = (
  raw: string,
  matchCase = false
): PreparedText => {
  const chars: string[] = [];
  const toRaw: number[] = [];

  for (let index = 0; index < raw.length; index += 1) {
    const current = raw[index];
    if (isSkipped(current)) continue;

    if (/\s/.test(current)) {
      if (chars[chars.length - 1] === " ") continue;
      chars.push(" ");
      toRaw.push(index);
      continue;
    }

    chars.push(foldChar(current, matchCase));
    toRaw.push(index);
  }

  return { normalized: chars.join(""), toRaw };
};

export const normalizeQuery = (value: string, matchCase = false) =>
  normalizeWithMap(value, matchCase).normalized.trim();

export const prepareParagraphs = (
  paragraphs: string[],
  matchCase = false
): PreparedParagraph[] =>
  paragraphs.map((text) => ({
    text,
    ...normalizeWithMap(text, matchCase),
  }));
