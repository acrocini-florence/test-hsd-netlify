import { CardList, CardListItem, mqUntil, Title } from "@biesse-group/react-components";
import dayjs from "dayjs";
import { graphql, navigate } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { useLabels } from "../../hooks/useLabels";
import { translatePath } from "../../i18n/localize-path";
import { useLayoutContext } from "../Layout/layoutContext";
import { Link } from "../Link";
import { NewsletterStrip } from "../NewsletterStrip";
import { RichText } from "../RichText";
import { Section } from "../Section";

const BodyGrid = styled.div`
  padding-top: 30px;
  display: grid;
  grid-template-columns: 2fr auto 1fr;
  column-gap: 36px;
  grid-template-rows: repeat(2, auto);
  row-gap: 90px;
  grid-template-areas:
    "body border image-gallery"
    "body border linked-articles";

  ${mqUntil(
    "md",
    css`
      grid-template-columns: auto;
      grid-template-rows: repeat(3, auto);
      grid-template-areas: "body" "image-gallery" "linked-articles";
    `
  )}
`;

const RichTextWrapper = styled.div`
  grid-area: body;
  margin: 20px 0px;
  ${mqUntil(
    "sm",
    css`
      margin: 0px;
    `
  )}
`;

const StyledBorder = styled.div`
  grid-area: border;
  border-right: 1px ${(props) => props.theme.color.gray} solid;
  ${mqUntil(
    "md",
    css`
      display: none;
    `
  )}
`;

const ImageGrid = styled.div`
  grid-area: image-gallery;
  display: grid;
  grid-template-columns: [title-start] repeat(4, 1fr) [title-end];
  grid-template-rows: auto;
  grid-auto-flow: row;
  grid-auto-rows: 1fr;
  column-gap: 20px;
  row-gap: 20px;
  margin-top: 20px;

  ${mqUntil(
    "md",
    css`
      grid-template-columns: [title-start] repeat(2, 1fr) [title-end];
    `
  )}

  ${mqUntil(
    "sm",
    css`
      margin-top: 0px;
    `
  )}
`;

const StyledImage = styled(GatsbyImage)`
  width: 100%;
  border-bottom-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const ArticlesItem = styled(CardList)`
  grid-area: linked-articles;
  margin-bottom: 20px;
  ${mqUntil(
    "sm",
    css`
      margin-bottom: 0px;
    `
  )}
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

export interface NewsAndEventsBodyProps {
  className?: string;
  contentfulElement: Queries.NewsBodyFragment | Queries.EventBodyFragment;
}

export const NewsAndEventsBody: FC<NewsAndEventsBodyProps> = ({ contentfulElement }) => {
  const { language } = useLayoutContext();

  const labels = useLabels([
    "news-detail-image-gallery",
    "news-detail-related-articles",
    "news-read-more-button",
  ]);

  return (
    <Root>
      <Section verticalSpace={false}>
        <BodyGrid>
          <RichTextWrapper>
            <RichText responsive={false} raw={contentfulElement.article?.raw} />
          </RichTextWrapper>
          {(contentfulElement.imageGallery?.length ||
            contentfulElement.relatedArticles?.length) && <StyledBorder />}
          {contentfulElement.imageGallery?.length && (
            <ImageGrid>
              <Title
                color="primary"
                variant="h2"
                size="sm"
                uppercase
                style={{
                  gridArea: " 1 / title-start / span 1 / title-end ",
                  marginBottom: "10px",
                }}
              >
                {labels["news-detail-image-gallery"]}
              </Title>
              {contentfulElement.imageGallery.map(
                (image, i) =>
                  image?.gatsbyImageData && (
                    <StyledImage
                      key={i}
                      alt={image.description ?? image.title ?? ""}
                      image={image?.gatsbyImageData}
                      style={{ width: "100%" }}
                    />
                  )
              )}
            </ImageGrid>
          )}
          {contentfulElement.relatedArticles?.length && (
            <ArticlesItem title={labels["news-detail-related-articles"] || "related articles"}>
              {contentfulElement.relatedArticles.map((relatedArticle, i) => {
                const newsPath = translatePath({
                  path: "news/{slug}",
                  language,
                  params: { slug: relatedArticle?.slug },
                });

                return (
                  <CardListItem
                    key={i}
                    buttonLabel={labels["news-read-more-button"] || "Read More"}
                    onClick={() => navigate(newsPath)}
                    preTitle={
                      relatedArticle?.date
                        ? `${dayjs(relatedArticle.date).locale(language).format("LL")}`
                        : undefined
                    }
                    title={<Link to={newsPath}>{relatedArticle?.title}</Link>}
                    titleTag="h2"
                    image={
                      relatedArticle?.image?.gatsbyImageData && (
                        <GatsbyImage
                          alt={relatedArticle?.title || ""}
                          image={relatedArticle.image.gatsbyImageData}
                          style={{ height: "100%", width: "100%" }}
                        />
                      )
                    }
                  />
                );
              })}
            </ArticlesItem>
          )}
        </BodyGrid>
      </Section>
      <Section horizontalSpace={false}>
        <NewsletterStrip />
      </Section>
    </Root>
  );
};

export const query = graphql`
  fragment NewsBody on ContentfulNews {
    relatedArticles {
      slug
      image {
        gatsbyImageData
      }
      title
      date
      location
    }
    imageGallery {
      gatsbyImageData
      title
      description
    }
    article {
      raw
    }
  }
  fragment EventBody on ContentfulEvent {
    relatedArticles {
      slug
      image {
        gatsbyImageData
      }
      title
      date
      location
    }
    imageGallery {
      gatsbyImageData
      title
      description
    }
    article {
      raw
    }
  }
`;
