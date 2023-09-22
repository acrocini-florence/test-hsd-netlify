import { Input, mqUntil, Spinner, Text, Title } from "@biesse-group/react-components";
import React, { FC, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { SearchResultItemCard } from "../components/search";
import { SearchIconButton } from "../components/search/SearchIIconButton";
import { PageType, SiteArea, useDataLayer, useTrackPageview } from "../hooks/data-layer";
import { useGoogleSearchAPI } from "../hooks/search";
import { useLabels } from "../hooks/useLabels";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  padding: 54px 90px 42px;
  max-width: 65%;

  ${mqUntil(
    "lg",
    css`
      max-width: 70%;
    `
  )}

  ${mqUntil(
    "md",
    css`
      padding: 52px 25px 40px;
      max-width: 80%;
    `
  )}

  ${mqUntil(
    "sm",
    css`
      padding: 0px 0px 35px 0px;
    `
  )}
`;

const StyledTitle = styled(Title)`
  text-align: center;
`;

const StyledDivider = styled.hr`
  margin: 32px 0 48px;
  border-top: 1px solid lightgray;
`;

const EmptyStateContainer = styled.div`
  margin: 0 auto;
`;

export const QS_QUERY_KEY = "q";
export const QS_SOURCE_KEY = "source";
const HEADER_SOURCE = "header";

const SearchPage: FC = () => {
  const labels = useLabels(["search-title", "search-modal-form-placeholder", "search-empty-state"]);

  const trackPageview = useTrackPageview();
  useEffect(() => {
    trackPageview({
      page_type: PageType.Search,
      site_area: SiteArea.Search,
      breadcrumbs: null,
      material: null,
      technology: null,
      line: null,
    });
  }, [trackPageview]);

  const { search, isLoading, result } = useGoogleSearchAPI();

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [firstSearched, setFirstSearched] = useState(false);
  useEffect(() => {
    setFirstSearched(true);
    const q = new URLSearchParams(window.location.search).get(QS_QUERY_KEY) || "";
    setInputValue(q);
    setSearchQuery(q);
  }, []);

  // Debounced search
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (!inputValue) {
      return;
    }
    if (firstUpdate.current) {
      firstUpdate.current = false;
      search(inputValue);
      return;
    }
    const timeOutId = setTimeout(() => {
      search(inputValue);
      setSearchQuery(inputValue);
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [inputValue, search]);

  const { pushEvent } = useDataLayer();

  useEffect(() => {
    if (result?.queries) {
      const searchPlace =
        new URLSearchParams(window.location.search).get(QS_SOURCE_KEY) || HEADER_SOURCE;

      pushEvent({
        event: "search_complete",
        search_place: searchPlace,
        // this is to avoid that the effect is triggered by inputValue change, firing twice
        search_term: result.queries.request[0].searchTerms,
        search_result: (result.items?.length || 0).toString(),
      });
    }
  }, [result, pushEvent]);

  const handleSubmit = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set(QS_QUERY_KEY, inputValue);
        searchParams.set(QS_SOURCE_KEY, HEADER_SOURCE);
        window.location.search = searchParams.toString();
      }
    },
    [inputValue]
  );

  return (
    <Root>
      <StyledTitle variant="h2" size="lg" color="primary">
        {labels["search-title"]}
      </StyledTitle>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          border
          placeholder={labels["search-modal-form-placeholder"] ?? undefined}
          onChange={(e) => setInputValue(e.target.value)}
          shadow="dark"
          endDecoration={<SearchIconButton onClick={handleSubmit} />}
        />
      </form>
      <StyledDivider />
      {result?.items?.length ? (
        result.items.map(({ htmlTitle, link, htmlSnippet }) => (
          <SearchResultItemCard key={link} title={htmlTitle} url={link} snippet={htmlSnippet} />
        ))
      ) : (
        <EmptyStateContainer>
          {isLoading || !firstSearched ? (
            <Spinner />
          ) : (
            <Text>
              {labels["search-empty-state"]} <strong>&quot;{searchQuery}&quot;</strong>
            </Text>
          )}
        </EmptyStateContainer>
      )}
    </Root>
  );
};

export default SearchPage;
