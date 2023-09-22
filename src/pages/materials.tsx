import { HeroBanner, Icon, IconName, IconProps, mqUntil } from "@biesse-group/react-components";
import { graphql, HeadProps, PageProps } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC, useEffect } from "react";
import styled, { css } from "styled-components";

import { CatalogCard } from "../components/catalog/CatalogCard";
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

const MaterialsPage: React.FC<PageProps<Queries.MaterialsPageQuery>> = ({
  data: { allContentfulMaterial: materials, contentfulHeroBanner },
}) => {
  const labels = useLabels(["material-card-action"]);

  const trackPageview = useTrackPageview();
  useEffect(() => {
    trackPageview({
      page_type: PageType.Materials,
      site_area: SiteArea.Products,
      breadcrumbs: null,
      material: null,
      technology: null,
      line: null,
    });
  }, [trackPageview]);

  const { language } = useLayoutContext();
  return (
    <div>
      {contentfulHeroBanner && (
        <HeroBanner
          title={contentfulHeroBanner.title ?? ""}
          description={<RichText raw={contentfulHeroBanner.description?.raw} />}
          image={
            contentfulHeroBanner.image?.gatsbyImageData && (
              <StyledImage
                loading="eager"
                image={contentfulHeroBanner.image?.gatsbyImageData}
                alt={contentfulHeroBanner.title ?? ""}
              />
            )
          }
        />
      )}
      <Section>
        <CardGrid>
          {materials.nodes.map((material, i) => (
            <CatalogCard
              abstract={<RichText raw={material.abstract?.raw} />}
              to={translatePath({
                path: "materials/{slug}",
                language,
                params: { slug: material.slug },
              })}
              title={material.materialName ?? ""}
              actionLabel={labels["material-card-action"] || "See All"}
              key={i}
              image={
                <Icon
                  color={material.key as IconProps["color"]}
                  name={`material-${material.key}` as IconName}
                  size="80px"
                />
              }
            />
          ))}
        </CardGrid>
      </Section>
    </div>
  );
};

export default MaterialsPage;

export const Head: FC<HeadProps<Queries.MaterialsPageQuery, { language: string }>> = ({
  data: { contentfulPageMetadata: meta },
  pageContext: { language },
}) => {
  return (
    <SEO
      htmlLang={language}
      title={meta?.metaTitle}
      description={meta?.metaDescription}
      image={meta?.metaImage?.url}
      path="materials"
      alternateParams={undefined}
    />
  );
};

export const query = graphql`
  query MaterialsPage($language: String) {
    allContentfulMaterial(sort: { materialName: ASC }, filter: { node_locale: { eq: $language } }) {
      nodes {
        ...MaterialData
        materialName
        originalEntry {
          materialName
        }
        abstract {
          raw
        }
      }
    }
    contentfulHeroBanner(handler: { eq: "materials page" }, node_locale: { eq: $language }) {
      image {
        gatsbyImageData
      }
      description {
        raw
      }
      title
    }

    contentfulPageMetadata(handler: { eq: "materials" }, node_locale: { eq: $language }) {
      ...Metadata
    }
  }
`;
