import { HeroBanner, mqUntil } from "@biesse-group/react-components";
import { graphql, HeadProps, PageProps } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC, useEffect } from "react";
import styled, { css } from "styled-components";

import { CatalogCard } from "../components/catalog/CatalogCard";
import { ContentfulImage } from "../components/ContentfulImage";
import { useLayoutContext } from "../components/Layout/layoutContext";
import { RichText } from "../components/RichText";
import { Section } from "../components/Section";
import { SEO } from "../components/Seo/Seo";
import { PageType, SiteArea, useTrackPageview } from "../hooks/data-layer";
import { useLabels } from "../hooks/useLabels";
import { translatePath } from "../i18n/localize-path";

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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 20px;
  row-gap: 20px;
  width: 100%;

  ${mqUntil(
    "md",
    css`
      grid-template-columns: repeat(2, 1fr);
    `
  )}

  ${mqUntil(
    "sm",
    css`
      grid-template-columns: 1fr;
    `
  )}
`;

const ProductFamilies: FC<PageProps<Queries.ProductFamiliesQuery>> = ({
  data: { contentfulHeroBanner: banner, allContentfulTechnology: technologies },
}) => {
  const labels = useLabels(["catalog-see-all-button"]);
  const { language } = useLayoutContext();

  const trackPageview = useTrackPageview();
  useEffect(() => {
    trackPageview({
      page_type: PageType.ProductFamilies,
      site_area: SiteArea.Products,
      breadcrumbs: null,
      material: null,
      technology: null,
      line: null,
    });
  }, [trackPageview]);

  return (
    <div>
      <HeroBanner
        description={<RichText raw={banner?.description?.raw} />}
        image={
          banner?.image?.gatsbyImageData && (
            <StyledImage
              loading="eager"
              image={banner.image.gatsbyImageData}
              alt="Hero Banner Img"
            />
          )
        }
        title={banner?.title ?? ""}
      />
      <Section>
        <CardGrid>
          {technologies.nodes?.map((tech, i) => (
            <CatalogCard
              abstract={<RichText raw={tech?.description?.raw} />}
              to={translatePath({
                path: "product-families/{slug}",
                language,
                params: { slug: tech.slug },
              })}
              title={tech?.technologyName ?? ""}
              titleTag="h2"
              actionLabel={labels["catalog-see-all-button"]!}
              key={i}
              image={
                tech?.cardImage && (
                  <ContentfulImage
                    alt={tech?.technologyName ?? ""}
                    image={tech.cardImage}
                    svgImageProps={{ width: "100%", height: "100%" }}
                  />
                )
              }
            />
          ))}
        </CardGrid>
      </Section>
    </div>
  );
};

export default ProductFamilies;

export const Head: FC<HeadProps<Queries.ProductFamiliesQuery, { language: string }>> = ({
  data: { contentfulPageMetadata: meta },
  pageContext: { language },
}) => {
  return (
    <SEO
      htmlLang={language}
      title={meta?.metaTitle}
      description={meta?.metaDescription}
      image={meta?.metaImage?.url}
      path="product-families"
      alternateParams={undefined}
    />
  );
};

export const query = graphql`
  query ProductFamilies($language: String) {
    contentfulHeroBanner(handler: { eq: "technologies-page" }, node_locale: { eq: $language }) {
      image {
        gatsbyImageData
      }
      description {
        raw
      }
      title
    }
    allContentfulTechnology(
      sort: { technologyName: ASC }
      filter: { node_locale: { eq: $language } }
    ) {
      nodes {
        slug
        technologyName
        originalEntry {
          technologyName
        }
        description {
          raw
        }
        cardImage {
          ...ContentfulImageData
        }
      }
    }

    contentfulPageMetadata(handler: { eq: "product-families" }, node_locale: { eq: $language }) {
      ...Metadata
    }
  }
`;
