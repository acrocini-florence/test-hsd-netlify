import { mqUntil, Pagination, Text } from "@biesse-group/react-components";
import { graphql, HeadProps, navigate, PageProps } from "gatsby";
import React, { FC, useEffect } from "react";
import styled, { css } from "styled-components";

import { useLayoutContext } from "../components/Layout/layoutContext";
import { EventStrip } from "../components/news-and-events/events/EventStrip";
import { NewsCard } from "../components/news-and-events/news/NewsCard";
import { NewsFilterTabs } from "../components/news-and-events/news/NewsFilterTabs";
import { Section } from "../components/Section";
import { SEO } from "../components/Seo/Seo";
import { SiteArea, useTrackPageview } from "../hooks/data-layer";
import { useLabels } from "../hooks/useLabels";
import config from "../i18n/config";
import { translatePath } from "../i18n/localize-path";

const Root = styled.div`
  margin-top: 70px;

  ${mqUntil(
    "md",
    css`
      margin-top: 35px;
    `
  )}
`;

const PageGrid = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(4, minmax(auto, calc((100% - 17px * 3) / 4)));
  column-gap: 17px;
  row-gap: 90px;
  width: 100%;

  ${mqUntil(
    "md",
    css`
      grid-template-columns: repeat(2, minmax(auto, calc((100% - 17px) / 2)));
    `
  )}

  ${mqUntil(
    "sm",
    css`
      grid-template-columns: auto;
      row-gap: 60px;
    `
  )}
`;

const StyledTabsSection = styled(Section)`
  margin-bottom: 60px;
  ${mqUntil(
    "sm",
    css`
      padding: 0px;
    `
  )}
`;

const NewsAndEventsPage: FC<
  PageProps<
    Queries.NewsAndEventsQuery,
    { skip: number; limit: number; filter: string[]; currentPage: number; totalPages: number }
  >
> = ({ data, pageContext }) => {
  const { filter, currentPage, totalPages } = pageContext;
  const { language } = useLayoutContext();

  const labels = useLabels(["news-and-events-no-news-found"]);

  const trackPageview = useTrackPageview();
  useEffect(() => {
    trackPageview({
      page_type: filter.length === 1 ? filter[0] : "all",
      site_area: SiteArea.NewsAndEvents,
      breadcrumbs: null,
      material: null,
      technology: null,
      line: null,
    });
  }, [trackPageview, filter]);

  return (
    <Root>
      <StyledTabsSection verticalSpace={false}>
        <NewsFilterTabs filter={filter} />
      </StyledTabsSection>
      <Section style={{ paddingTop: "0px" }}>
        {data.allContentfulNews.nodes.length > 0 ? (
          <PageGrid>
            {data.allContentfulNews.nodes.map((element, i) => (
              <NewsCard
                key={i}
                news={element as Queries.ContentfulNews}
                imgProps={{ loading: "eager" }}
              />
            ))}
          </PageGrid>
        ) : (
          <Text color="dark" size="lg">
            {labels["news-and-events-no-news-found"]}
          </Text>
        )}
      </Section>
      {totalPages > 1 && (
        <Section verticalSpace={false}>
          <Pagination
            onChangePage={(newPage) =>
              navigate(
                translatePath({
                  path: ["news-and-events", filter.length > 1 ? "" : "{filter}", "{page}"]
                    .filter(Boolean)
                    .join("/"),
                  language,
                  params: {
                    page: newPage > 1 ? newPage.toString() : "",
                    filter: filter[0],
                  },
                })
              )
            }
            pagesCount={totalPages}
            currentPage={currentPage}
          />
        </Section>
      )}
      {data.contentfulEventStrip && (
        <Section>
          <EventStrip eventStrip={data.contentfulEventStrip as Queries.ContentfulEventStrip} />
        </Section>
      )}
    </Root>
  );
};

export default NewsAndEventsPage;

export const Head: FC<
  HeadProps<Queries.NewsAndEventsQuery, { language: string; filter: string[]; currentPage: number }>
> = ({
  data: { contentfulPageMetadata: meta },
  pageContext: { language, filter, currentPage },
}) => {
  const path = [
    "news-and-events",
    filter.length > 1 ? "" : "{filter}",
    currentPage > 1 ? "{page}" : "",
  ]
    .filter(Boolean)
    .join("/");
  const altParams = config.locales.reduce(
    (acc, { localeCode }) => ({
      ...acc,
      [localeCode]: { page: currentPage, filter: filter[0] },
    }),
    {} as any
  );
  return (
    <SEO
      htmlLang={language}
      title={meta?.metaTitle}
      description={meta?.metaDescription}
      image={meta?.metaImage?.url}
      path={path}
      alternateParams={altParams}
    />
  );
};

export const query = graphql`
  query NewsAndEvents($skip: Int!, $limit: Int!, $filter: [String]!, $language: String) {
    allContentfulLabel(
      filter: { contentfulid: { in: ["header-news-and-events"] }, node_locale: { eq: $language } }
    ) {
      nodes {
        value
        contentfulid
        node_locale
      }
    }
    allContentfulNews(
      sort: { updatedAt: DESC }
      limit: $limit
      skip: $skip
      filter: { tag: { in: $filter }, node_locale: { eq: $language } }
    ) {
      nodes {
        slug
        title
        originalEntry {
          title
        }
        abstract {
          raw
        }
        date
        location
        tag
        image {
          gatsbyImageData
          mimeType
          url
        }
      }
    }
    contentfulEventStrip(handler: { eq: "homepage" }, node_locale: { eq: $language }) {
      ...EventStrip
    }

    contentfulPageMetadata(handler: { eq: "news-and-events" }, node_locale: { eq: $language }) {
      ...Metadata
    }
  }
`;
