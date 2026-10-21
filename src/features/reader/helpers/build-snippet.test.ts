import { describe, expect, it } from "vitest";

import { buildSnippet } from "./build-snippet";

describe("buildSnippet", () => {
  it("keeps the matched slice inside the snippet", () => {
    const source = "ابتدای یادداشت با کلمه جستجو تمام نمی‌شود و ادامه دارد.";
    const start = source.indexOf("جستجو");
    const snippet = buildSnippet(source, start, start + "جستجو".length, 8);

    expect(snippet.text.startsWith("…")).toBe(true);
    expect(snippet.text.endsWith("…")).toBe(true);
    expect(snippet.text.slice(snippet.matchStart, snippet.matchEnd)).toBe(
      "جستجو"
    );
  });

  it("extends the cut so a word is not sliced in half", () => {
    const source =
      "شروع الفبتثجحدذرزسشصضطظعغفقکگلمنوهی جستجو الفبتثجحدذرزسشصضطظعغفقکگلمنوهی پایان";
    const start = source.indexOf("جستجو");
    const snippet = buildSnippet(source, start, start + "جستجو".length, 4);

    expect(snippet.text.startsWith("…الفبتثجحدذرزسشصضطظعغفقکگلمنوهی")).toBe(
      true
    );
    expect(snippet.text.endsWith("الفبتثجحدذرزسشصضطظعغفقکگلمنوهی…")).toBe(true);
    expect(snippet.text.slice(snippet.matchStart, snippet.matchEnd)).toBe(
      "جستجو"
    );
  });
});
