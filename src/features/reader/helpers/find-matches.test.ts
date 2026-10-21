import { describe, expect, it } from "vitest";

import { findDocumentMatches } from "./find-matches";
import { prepareParagraphs } from "./normalize-search-text";

const search = (paragraphs: string[], query: string) =>
  findDocumentMatches(prepareParagraphs(paragraphs), query);

describe("findDocumentMatches", () => {
  it("returns every non-overlapping hit in reading order", () => {
    const matches = search(
      ["جستجو در ابتدای متن و یک جستجوی دیگر در پایان همین بند."],
      "جستجو"
    );

    expect(matches).toHaveLength(2);
    expect(matches.map((match) => match.id)).toEqual([0, 1]);
    expect(matches[0]?.paragraphIndex).toBe(0);
  });

  it("folds arabic letters, digits and case", () => {
    const source = ["كتاب Smart و عدد ۱۲ در متن است."];

    expect(search(source, "کتاب")).toHaveLength(1);
    expect(search(source, "smart")).toHaveLength(1);
    expect(search(source, "12")).toHaveLength(1);
  });

  it("matches a word whether or not it contains a zero-width non-joiner", () => {
    const matches = search(["این کار می‌شود اگر دقیق بگردی."], "میشود");

    expect(matches).toHaveLength(1);
    expect(matches[0]?.start).toBeGreaterThanOrEqual(0);
  });

  it("does not cross a paragraph boundary", () => {
    const matches = search(["سلام دنیا", "دنیا دوباره"], "دنیا دنیا");

    expect(matches).toHaveLength(0);
  });

  it("can keep or ignore latin letter case", () => {
    const source = ["کتابخانه React با بستهٔ react منتشر شده است."];
    const loose = search(source, "react");
    const exact = findDocumentMatches(prepareParagraphs(source, true), "react", true);
    const capital = findDocumentMatches(prepareParagraphs(source, true), "React", true);

    expect(loose).toHaveLength(2);
    expect(exact).toHaveLength(1);
    expect(capital).toHaveLength(1);
    expect(source[0]?.slice(exact[0]?.start, exact[0]?.end)).toBe("react");
    expect(source[0]?.slice(capital[0]?.start, capital[0]?.end)).toBe("React");
  });

  it("returns nothing for an empty query", () => {
    expect(search(["متن آماده است."], "   ")).toEqual([]);
  });
});
