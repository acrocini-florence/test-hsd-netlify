import { Button, Card, CardProps } from "@biesse-group/react-components";
import dayjs from "dayjs";
import { graphql } from "gatsby";
import { GatsbyImage, GatsbyImageProps } from "gatsby-plugin-image";
import React, { FC, useCallback } from "react";

import { useDataLayer } from "../../../hooks/data-layer";
import { useLabels } from "../../../hooks/useLabels";
import { translatePath } from "../../../i18n/localize-path";
import { useLayoutContext } from "../../Layout/layoutContext";
import { Link } from "../../Link";
import { NewsCategoryTag, NewsCategoryTagProps } from "./NewsCategoryTag";

export interface NewsCardProps extends Pick<CardProps, "titleSize"> {
  news: Queries.NewsCardFragment;
  className?: string;
  imgProps?: Omit<GatsbyImageProps, "image" | "alt">;
}

const labelsIds = ["news-read-more-button"];

export const NewsCard: FC<NewsCardProps> = ({ news, imgProps, ...props }) => {
  const { language } = useLayoutContext();

  const labels = useLabels(labelsIds);
  const originalLabels = useLabels(labelsIds, "en");

  const newsPath = translatePath({
    path: `news/{slug}`,
    params: {
      slug: news.slug,
    },
    language,
  });

  const { pushEvent } = useDataLayer();

  const onClickLink = useCallback(() => {
    pushEvent({
      event: "select_promotion",
      nome_banner: news.title,
      codice_univoco_banner: news.contentful_id,
      tipo_banner: "news",
      cta_cliccata: originalLabels["news-read-more-button"],
    });
  }, [originalLabels, news, pushEvent]);

  const date = news.date ? `${dayjs(news.date).locale(language).format("LL")}` : "";

  return (
    <Card
      {...props}
      tags={
        news.tag
          ? [
              <NewsCategoryTag
                key="0"
                category={news.tag as NewsCategoryTagProps["category"]}
                border
              />,
            ]
          : []
      }
      title={
        <Link to={newsPath} onClick={onClickLink}>
          {news.title ?? ""}
        </Link>
      }
      image={
        news.image?.gatsbyImageData && (
          <GatsbyImage image={news.image.gatsbyImageData} alt={news.title ?? ""} {...imgProps} />
        )
      }
      action={
        <Link to={newsPath} onClick={onClickLink}>
          <Button variant="primary-naked" size="small" rightIcon="chevron-right">
            {labels["news-read-more-button"]}
          </Button>
        </Link>
      }
      preTitle={`${date}${date && news.location ? ", " : ""}${news.location ?? ""}`}
    />
  );
};

export const query = graphql`
  fragment NewsCard on ContentfulNews {
    contentful_id
    title
    originalEntry {
      title
    }
    date
    location
    tag
    image {
      gatsbyImageData
      mimeType
      url
    }
    slug
  }
`;
