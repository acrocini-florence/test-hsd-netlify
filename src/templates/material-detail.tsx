import { HeroBanner, mqUntil } from "@biesse-group/react-components";
import { graphql, HeadProps, PageProps } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC, useEffect } from "react";
import styled, { css } from "styled-components";

import { CatalogBreadcrumb } from "../components/catalog/CatalogBreadcrumb";
import { CatalogCard } from "../components/catalog/CatalogCard";
import { ContentfulImage } from "../components/ContentfulImage";
import { DownloadCatalogForm } from "../components/forms/DownloadCatalogForm";
import { useLayoutContext } from "../components/Layout/layoutContext";
import { RichText } from "../components/RichText";
import { Section } from "../components/Section";
import { SEO } from "../components/Seo/Seo";
import { useCatalogBreadcrumbs } from "../hooks/breadcrumbs/useCatalogBreadcrumbs";
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

const MaterialDetail: FC<PageProps<Queries.MaterialDetailQuery, { slug: string }>> = ({
  data: { contentfulMaterial: material, allContentfulTechnology: technologies },
  pageContext: { slug: materialSlug },
}) => {
  const labels = useLabels(["catalog-see-all-button"]);

  const breadcrumbItems = useCatalogBreadcrumbs({
    material: material as Queries.ContentfulMaterial,
  });

  const trackPageview = useTrackPageview();
  useEffect(() => {
    trackPageview({
      page_type: PageType.Category,
      site_area: SiteArea.Products,
      breadcrumbs: breadcrumbItems,
      material: material as Queries.ContentfulMaterial,
      technology: null,
      line: null,
    });
  }, [trackPageview, material, breadcrumbItems]);

  const { language } = useLayoutContext();

  return material ? (
    <div>
      <HeroBanner
        breadcrumb={<CatalogBreadcrumb items={breadcrumbItems} />}
        title={material.pageTitle ?? ""}
        description={<RichText raw={material.abstract?.raw} />}
        image={
          material.bannerImage?.gatsbyImageData && (
            <StyledImage
              loading="eager"
              image={material.bannerImage.gatsbyImageData}
              alt={material.pageTitle ?? ""}
            />
          )
        }
      >
        {material.catalog?.url && (
          <DownloadCatalogForm
            catalogId={material.materialName ?? ""}
            catalogUrl={material.catalog.url}
          />
        )}
      </HeroBanner>
      <Section>
        <CardGrid>
          {technologies.nodes?.map((tech, i) => (
            <CatalogCard
              abstract={<RichText raw={tech?.description?.raw} />}
              to={translatePath({
                path: "materials/{materialSlug}/{techSlug}",
                language,
                params: { techSlug: tech.slug, materialSlug },
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
  ) : null;
};

export default MaterialDetail;

export const Head: FC<HeadProps<Queries.MaterialDetailQuery, { language: string }>> = ({
  data: { contentfulMaterial: material, slugs },
  pageContext: { language },
}) => {
  const alternateParams = slugs.nodes.reduce(
    (acc, { slug, node_locale }) => ({ ...acc, [node_locale]: { slug } }),
    {} as any
  );
  return (
    <SEO
      htmlLang={language}
      title={material?.metaTitle ?? material?.pageTitle}
      description={material?.metaDescription}
      image={material?.bannerImage?.url}
      path="materials/{slug}"
      alternateParams={alternateParams}
    />
  );
};

export const query = graphql`
  query MaterialDetail($slug: String, $language: String, $contentful_id: String) {
    slugs: allContentfulMaterial(filter: { contentful_id: { eq: $contentful_id } }) {
      nodes {
        slug
        node_locale
      }
    }
    contentfulMaterial(slug: { eq: $slug }, node_locale: { eq: $language }) {
      ...MaterialData
      abstract {
        raw
      }
      pageTitle
      materialName
      metaTitle
      metaDescription
      originalEntry {
        materialName
      }
      bannerImage {
        gatsbyImageData
        url
      }
      catalog {
        url
      }
    }
    allContentfulTechnology(
      sort: { technologyName: ASC }
      filter: {
        line: { elemMatch: { materials: { elemMatch: { slug: { eq: $slug } } } } }
        node_locale: { eq: $language }
      }
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
  }
`;
