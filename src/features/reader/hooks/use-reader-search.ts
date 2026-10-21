import { useCallback, useMemo, useState } from "react";

import {
  CASED_PARAGRAPHS,
  CASED_WORDS,
  DOCUMENT_WORDS,
  PREPARED_PARAGRAPHS,
} from "../constants/sample-document";
import { buildSuggestions } from "../helpers/build-suggestions";
import { findDocumentMatches } from "../helpers/find-matches";

export const useReaderSearch = () => {
  const [query, setQueryState] = useState("");
  const [matchCase, setMatchCaseState] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const matches = useMemo(
    () =>
      findDocumentMatches(
        matchCase ? CASED_PARAGRAPHS : PREPARED_PARAGRAPHS,
        query,
        matchCase
      ),
    [matchCase, query]
  );

  const suggestions = useMemo(
    () =>
      buildSuggestions(
        matchCase ? CASED_WORDS : DOCUMENT_WORDS,
        query,
        undefined,
        matchCase
      ),
    [matchCase, query]
  );

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    setActiveIndex(0);
  }, []);

  const setMatchCase = useCallback((value: boolean) => {
    setMatchCaseState(value);
    setActiveIndex(0);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((current) => {
      if (matches.length < 2) return current;
      return (current + 1) % matches.length;
    });
  }, [matches.length]);

  const goPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (matches.length < 2) return current;
      return (current - 1 + matches.length) % matches.length;
    });
  }, [matches.length]);

  const activeId = matches[activeIndex]?.id ?? -1;

  return {
    query,
    setQuery,
    matchCase,
    setMatchCase,
    matches,
    suggestions,
    activeIndex,
    activeId,
    setActiveIndex,
    goNext,
    goPrevious,
  };
};
