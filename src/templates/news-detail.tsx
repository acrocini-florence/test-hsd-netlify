import { Text } from "@biesse-group/react-components";
import dayjs from "dayjs";
import { graphql, HeadProps, navigate, PageProps } from "gatsby";
import React, { FC, useEffect } from "react";
import styled from "styled-components";

import { useLayoutContext } from "../components/Layout/layoutContext";
import {
  NewsCategoryTag,
  NewsCategoryTagProps,
} from "../components/news-and-events/news/NewsCategoryTag";
import { NewsAndEventsBody } from "../components/news-and-events/NewsAndEventsBody";
import { PageHeader } from "../components/PageHeader";
import { RichText } from "../components/RichText";
import { SEO } from "../components/Seo/Seo";
import { PageType, SiteArea, useDataLayer, useTrackPageview } from "../hooks/data-layer";
import { useLabels } from "../hooks/useLabels";
import { useLocalizedPath } from "../hooks/useLocalizedPath";

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledDateAbstract = styled(Text)`
  margin-bottom: 30px;
`;

const NewsDetail: FC<PageProps<Queries.NewsDetailQuery, { slug: string }>> = ({
  data: { contentfulNews: news },
}) => {
  const newsEventsPath = useLocalizedPath("news-and-events");
  const { language } = useLayoutContext();

  const labels = useLabels(["news-detail-back"]);

  const trackPageview = useTrackPageview();
  useEffect(() => {
    trackPageview({
      page_type: PageType.News,
      site_area: SiteArea.NewsAndEvents,
      breadcrumbs: null,
      material: null,
      technology: null,
      line: null,
    });
  }, [trackPageview]);

  const { pushEvent } = useDataLayer();
  useEffect(() => {
    pushEvent({
      event: "news_view",
      news_name: news?.originalEntry?.title ?? news?.title ?? "",
    });
  }, [news, pushEvent]);

  return news ? (
    <StyledRoot>
      <PageHeader
        image={news.image?.gatsbyImageData}
        title={news.title ?? ""}
        backLabel={labels["news-detail-back"]}
        onBack={() => navigate(newsEventsPath)}
        tags={
          news.tag
            ? [<NewsCategoryTag key="0" category={news.tag as NewsCategoryTagProps["category"]} />]
            : undefined
        }
        abstract={
          <div style={{ display: "flex", flexDirection: "column" }}>
            <StyledDateAbstract>
              {dayjs(news.date).locale(language).format("LL")}, {news.location}
            </StyledDateAbstract>
            <RichText raw={news.abstract?.raw} />
          </div>
        }
      />
      <NewsAndEventsBody contentfulElement={news} />
    </StyledRoot>
  ) : null;
};

export default NewsDetail;

export const Head: FC<HeadProps<Queries.NewsDetailQuery, { language: string }>> = ({
  data: { contentfulNews: news, slugs },
  pageContext: { language },
}) => {
  const alternateParams = slugs.nodes.reduce(
    (acc, { slug, node_locale }) => ({ ...acc, [node_locale]: { slug } }),
    {} as any
  );
  return (
    <SEO
      htmlLang={language}
      title={news?.metaTitle ?? news?.title}
      description={news?.metaDescription}
      image={news?.image?.url}
      path="news/{slug}"
      alternateParams={alternateParams}
    />
  );
};

export const query = graphql`
  query NewsDetail($slug: String, $language: String, $contentful_id: String) {
    slugs: allContentfulNews(filter: { contentful_id: { eq: $contentful_id } }) {
      nodes {
        slug
        node_locale
      }
    }
    contentfulNews(slug: { eq: $slug }, node_locale: { eq: $language }) {
      date
      abstract {
        raw
      }
      image {
        gatsbyImageData
        url
      }
      location
      slug
      tag
      title
      metaTitle
      metaDescription
      originalEntry {
        title
      }
      ...NewsBody
    }
  }
`;
