import { mqUntil, Tabs, TabsProps, Title } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { useLabels } from "../../../hooks/useLabels";
import { useLocalizedPath } from "../../../hooks/useLocalizedPath";
import { NEWS_FILTERS } from "../news-and-events-constants";

const Root = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: [title-start]auto 1fr;
  grid-template-areas: "tags tags";

  ${mqUntil(
    "md",
    css`
      grid-template-columns: [title-start]auto;
      grid-template-rows: auto auto;
      grid-template-areas:
        "."
        "tags";
      row-gap: 12px;
    `
  )}
`;

const StyledNewsTitle = styled(Title)`
  margin-bottom: 0px;
  grid-area: 1 / title-start;
  align-self: center;
  ${mqUntil(
    "sm",
    css`
      padding: 0px 20px;
    `
  )}
`;

const TabsWrapper = styled.div`
  grid-area: tags;
  align-self: center;
  justify-self: center;
  min-width: 0px;
  max-width: 100%;
`;

const StyledTabs = styled(Tabs)`
  ${mqUntil(
    "sm",
    css`
      padding: 0px 20px;
    `
  )}
`;

export interface NewsFilterTabsProps {
  filter: string[];
}

export const NewsFilterTabs: FC<NewsFilterTabsProps> = ({ filter, ...props }) => {
  const newsEventsPath = useLocalizedPath("news-and-events");
  const labels: Record<string, string | null> = useLabels([
    "news-category-corporate",
    "news-category-products",
    "news-category-events",
    "news-category-exhibitions",
    "news-category-all",
    "news-and-events-page-news-title",
  ]);

  try {
    const tabs: TabsProps["tabs"] = [
      { id: "all", label: labels["news-category-all"] || "all", linkUrl: newsEventsPath },
    ].concat(
      NEWS_FILTERS.map((e) => ({
        id: e,
        label: labels[`news-category-${e}`] || e,
        linkUrl: `${newsEventsPath}${e}`,
      }))
    );
    let selectedTab: string;
    if (NEWS_FILTERS.every((v) => filter.includes(v))) {
      selectedTab = "all";
    } else if (filter.length === 1) {
      selectedTab = filter[0];
    } else {
      throw new Error("Filter array is empty. It should not be possible, check Gatsby Node.");
    }

    return (
      <Root {...props}>
        <StyledNewsTitle color="primary" variant="h1">
          {labels["news-and-events-page-news-title"]}
        </StyledNewsTitle>
        <TabsWrapper>
          <StyledTabs selected={selectedTab} tabs={tabs} />
        </TabsWrapper>
      </Root>
    );
  } catch (e) {
    console.error(e);
    return <></>;
  }
};
