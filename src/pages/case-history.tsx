import { HeroBanner, mqUntil } from "@biesse-group/react-components";
import { graphql, HeadProps, PageProps } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC, useEffect } from "react";
import styled, { css } from "styled-components";

import { ProjectStrip } from "../components/case-history/ProjectStrip";
import { RichText } from "../components/RichText";
import { Section } from "../components/Section";
import { SEO } from "../components/Seo/Seo";
import { PageType, SiteArea, useTrackPageview } from "../hooks/data-layer";

const StyledImage = styled(GatsbyImage)`
  width: 100%;

  ${mqUntil(
    "md",
    css`
      height: 100%;
      width: auto;
    `
  )}
`;

const CaseHistoryPage: FC<PageProps<Queries.CaseHistoryQuery>> = ({ data }) => {
  const trackPageview = useTrackPageview();
  useEffect(() => {
    trackPageview({
      page_type: PageType.CaseHistory,
      site_area: SiteArea.CaseHistory,
      breadcrumbs: null,
      material: null,
      technology: null,
      line: null,
    });
  }, [trackPageview]);

  const firstStrip = data.allContentfulProjectStrip.nodes.find(
    (x) => x.handler === "case history projects (1)"
  );
  const secondStrip = data.allContentfulProjectStrip.nodes.find(
    (x) => x.handler === "case history projects (2)"
  );
  const thirdStrip = data.allContentfulProjectStrip.nodes.find(
    (x) => x.handler === "case history projects (3)"
  );
  return (
    <div>
      {data.contentfulHeroBanner && (
        <HeroBanner
          title={data.contentfulHeroBanner.title ?? ""}
          description={<RichText raw={data.contentfulHeroBanner.description?.raw} />}
          image={
            data.contentfulHeroBanner.image?.gatsbyImageData && (
              <StyledImage
                loading="eager"
                image={data.contentfulHeroBanner.image.gatsbyImageData}
                alt={data.contentfulHeroBanner.title ?? ""}
              />
            )
          }
        />
      )}
      <Section horizontalSpace={false}>
        {firstStrip && (
          <Section>
            <ProjectStrip
              projectStrip={firstStrip}
              mobileBehavior="wrap"
              withTitle={false}
              projectCardTitleTag="h2"
            />
          </Section>
        )}
        {secondStrip && (
          <Section>
            <ProjectStrip
              projectStrip={secondStrip}
              mobileBehavior="wrap"
              withTitle={false}
              projectCardTitleTag="h2"
            />
          </Section>
        )}
        {thirdStrip && (
          <Section>
            <ProjectStrip
              projectStrip={thirdStrip}
              variant="1-2-2"
              mobileBehavior="wrap"
              withTitle={false}
              projectCardTitleTag="h2"
            />
          </Section>
        )}
      </Section>
    </div>
  );
};

export default CaseHistoryPage;

export const Head: FC<HeadProps<Queries.CaseHistoryQuery, { language: string }>> = ({
  data: { contentfulPageMetadata: meta },
  pageContext: { language },
}) => {
  return (
    <SEO
      htmlLang={language}
      title={meta?.metaTitle}
      description={meta?.metaDescription}
      image={meta?.metaImage?.url}
      path="case-history"
      alternateParams={undefined}
    />
  );
};

export const query = graphql`
  query CaseHistory($language: String) {
    contentfulHeroBanner(handler: { eq: "case history" }, node_locale: { eq: $language }) {
      image {
        gatsbyImageData
      }
      description {
        raw
      }
      title
    }
    allContentfulProjectStrip(
      filter: {
        node_locale: { eq: $language }
        handler: {
          in: [
            "case history projects (1)"
            "case history projects (2)"
            "case history projects (3)"
          ]
        }
      }
    ) {
      nodes {
        handler
        ...ProjectStrip
      }
    }

    contentfulPageMetadata(handler: { eq: "case-history" }, node_locale: { eq: $language }) {
      ...Metadata
    }
  }
`;
