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

const ProductFamilyDetail: FC<
  PageProps<Queries.ProductFamilyDetailQuery, { slug: string; material?: string }>
> = ({
  data: {
    contentfulTechnology: technology,
    allContentfulLine: lines,
    contentfulMaterial: material,
  },
  pageContext: { slug: technologySlug, material: materialSlug },
}) => {
  const labels = useLabels(["catalog-see-all-button"]);

  const { language } = useLayoutContext();

  const breadcrumbItems = useCatalogBreadcrumbs({
    material: materialSlug ? (material as Queries.ContentfulMaterial) : undefined,
    technology: technology as Queries.ContentfulTechnology,
  });

  const trackPageview = useTrackPageview();
  useEffect(() => {
    trackPageview({
      page_type: PageType.Category,
      site_area: SiteArea.Products,
      breadcrumbs: breadcrumbItems,
      material: materialSlug ? (material as Queries.ContentfulMaterial) : null,
      technology: technology as Queries.ContentfulTechnology,
      line: null,
    });
  }, [breadcrumbItems, material, materialSlug, technology, trackPageview]);

  return (
    <div>
      <HeroBanner
        breadcrumb={<CatalogBreadcrumb items={breadcrumbItems} />}
        description={<RichText raw={technology?.description?.raw} />}
        image={
          technology?.bannerImage?.gatsbyImageData && (
            <StyledImage
              loading="eager"
              alt={technology?.technologyName ?? ""}
              image={technology?.bannerImage?.gatsbyImageData}
            />
          )
        }
        title={technology?.technologyName ?? ""}
      >
        {technology?.catalog?.url && (
          <DownloadCatalogForm
            catalogId={technology.technologyName ?? ""}
            catalogUrl={technology.catalog.url}
          />
        )}
      </HeroBanner>
      <Section>
        <CardGrid>
          {lines?.nodes?.map((line, i) => {
            const path = [
              materialSlug ? `materials` : "product-families",
              materialSlug && "{materialSlug}",
              "{technologySlug}",
              "{lineSlug}",
            ]
              .filter(Boolean)
              .join("/");

            return (
              <CatalogCard
                preTitle={technology?.technologyName ?? ""}
                abstract={<RichText raw={line?.abstract?.raw} />}
                to={translatePath({
                  path,
                  language,
                  params: {
                    technologySlug,
                    materialSlug,
                    lineSlug: line.slug,
                  },
                })}
                title={line?.lineName ?? ""}
                titleTag="h2"
                actionLabel={labels["catalog-see-all-button"] ?? ""}
                key={i}
                image={
                  line?.cardImage && (
                    <ContentfulImage
                      alt={line?.lineName ?? ""}
                      image={line.cardImage}
                      svgImageProps={{ width: "100%", height: "100%" }}
                    />
                  )
                }
              />
            );
          })}
        </CardGrid>
      </Section>
    </div>
  );
};

export default ProductFamilyDetail;

export const Head: FC<
  HeadProps<Queries.ProductFamilyDetailQuery, { language: string; material?: string }>
> = ({
  pageContext: { language, material },
  data: { contentfulTechnology: technology, materialSlugs, technologySlugs },
}) => {
  const technologyParams = technologySlugs.nodes.reduce(
    (acc, { slug, node_locale }) => ({ ...acc, [node_locale]: { slug } }),
    {} as any
  );
  const alternateParams = materialSlugs.nodes.reduce(
    (acc, { slug, node_locale }) => ({
      ...acc,
      [node_locale]: { ...technologyParams?.[node_locale], materialSlug: slug },
    }),
    {} as any
  );
  return (
    <SEO
      htmlLang={language}
      title={technology?.metaTitle ?? technology?.technologyName}
      description={technology?.metaDescription}
      image={technology?.bannerImage?.url}
      path={material ? "materials/{materialSlug}/{slug}" : "product-families/{slug}"}
      alternateParams={alternateParams}
    />
  );
};

export const query = graphql`
  query ProductFamilyDetail(
    $slug: String
    $material: String
    $language: String
    $contentful_id: String
    $materialContentful_id: String
  ) {
    technologySlugs: allContentfulTechnology(filter: { contentful_id: { eq: $contentful_id } }) {
      nodes {
        slug
        node_locale
      }
    }
    materialSlugs: allContentfulMaterial(
      filter: { contentful_id: { eq: $materialContentful_id } }
    ) {
      nodes {
        slug
        node_locale
      }
    }
    contentfulTechnology(slug: { eq: $slug }, node_locale: { eq: $language }) {
      description {
        raw
      }
      metaTitle
      metaDescription
      catalog {
        url
      }
      originalEntry {
        technologyName
      }
      technologyName
      bannerImage {
        gatsbyImageData
        url
      }
    }
    contentfulMaterial(slug: { eq: $material }, node_locale: { eq: $language }) {
      ...MaterialData
      materialName
      originalEntry {
        materialName
      }
    }
    allContentfulLine(
      filter: {
        technology: { slug: { eq: $slug } }
        materials: { elemMatch: { slug: { eq: $material } } }
        node_locale: { eq: $language }
      }
      sort: { lineName: ASC }
    ) {
      nodes {
        slug
        lineName
        originalEntry {
          lineName
        }
        abstract {
          raw
        }
        cardImage {
          ...ContentfulImageData
        }
      }
    }
  }
`;
