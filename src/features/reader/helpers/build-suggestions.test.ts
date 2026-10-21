import { describe, expect, it } from "vitest";

import { buildSuggestions, collectWords } from "./build-suggestions";

describe("buildSuggestions", () => {
  const words = collectWords("جستجو جستجوی متن هایلایت Smart search");

  it("prefers the shorter prefix and skips the exact query", () => {
    const suggestions = buildSuggestions(words, "جست");

    expect(suggestions.map((item) => item.label)).toEqual(["جستجو", "جستجوی"]);
  });

  it("returns nothing when the query is blank", () => {
    expect(buildSuggestions(words, "  ")).toEqual([]);
  });

  it("keeps distinct casings when letter case matters", () => {
    const cased = collectWords("React react", true);

    expect(buildSuggestions(cased, "Rea", 6, true).map((item) => item.label)).toEqual([
      "React",
    ]);
    expect(buildSuggestions(cased, "rea", 6, true).map((item) => item.label)).toEqual([
      "react",
    ]);
  });

  it("falls back to words that contain the query", () => {
    const suggestions = buildSuggestions(words, "های");

    expect(suggestions.map((item) => item.label)).toContain("هایلایت");
  });
});
