import { useCallback, useState } from "react";

import { SearchResult } from "./types";

const googleAPIBaseUrl = `https://www.googleapis.com/customsearch/v1/siterestrict`;

export function useGoogleSearchAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [result, setResult] = useState<null | SearchResult>(null);

  const search = useCallback(async (q: string) => {
    const cx = process.env.GATSBY_GOOGLE_SEARCH_ENGINE_ID;
    const key = process.env.GATSBY_GOOGLE_SEARCH_API_KEY;

    if (!cx || !key) {
      console.error("Google Search API > missing configuration");
      return;
    }
    const searchUrl = `${googleAPIBaseUrl}?${new URLSearchParams({
      cx,
      key,
      q,
    })}`;
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch(searchUrl);
      const data = await response.json();
      setResult(data as SearchResult);
      setError(null);
    } catch (e) {
      setError(e);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    result,
    error,
    isLoading,
    search,
  };
}
