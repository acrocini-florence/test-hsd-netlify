import { HeroBanner, mqUntil } from "@biesse-group/react-components";
import { graphql, HeadProps, PageProps } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC, useEffect, useMemo } from "react";
import styled, { css } from "styled-components";

import { CatalogBreadcrumb } from "../components/catalog/CatalogBreadcrumb";
import { DownloadCatalogForm } from "../components/forms/DownloadCatalogForm";
import { ProductCard } from "../components/products/ProductCard";
import { RichText } from "../components/RichText";
import { Section } from "../components/Section";
import { SEO } from "../components/Seo/Seo";
import { useCatalogBreadcrumbs } from "../hooks/breadcrumbs/useCatalogBreadcrumbs";
import { PageType, SiteArea, useTrackPageview } from "../hooks/data-layer";
import { useLabels } from "../hooks/useLabels";

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

const ProductLineDetail: FC<
  PageProps<Queries.LineDetailQuery, { slug: string; material?: string }>
> = ({
  data: { contentfulLine: line, allContentfulProduct: products, contentfulMaterial: material },
  pageContext: { material: materialSlug },
}) => {
  const labels = useLabels(["catalog-discover-button"]);

  const queryParams = useMemo(() => {
    let params = new URLSearchParams({
      line: line?.slug || "",
    });
    if (materialSlug) {
      params.append("material", materialSlug);
    }
    return params.toString();
  }, [line?.slug, materialSlug]);

  const breadcrumbItems = useCatalogBreadcrumbs({
    material: materialSlug ? (material as Queries.ContentfulMaterial) : undefined,
    technology: line?.technology as Queries.ContentfulTechnology,
    line: line as Queries.ContentfulLine,
  });

  const trackPageview = useTrackPageview();
  useEffect(() => {
    trackPageview({
      page_type: PageType.Category,
      site_area: SiteArea.Products,
      breadcrumbs: breadcrumbItems,
      material: materialSlug ? (material as Queries.ContentfulMaterial) : null,
      technology: line?.technology as Queries.ContentfulTechnology,
      line: line as Queries.ContentfulLine,
    });
  }, [breadcrumbItems, line, material, materialSlug, trackPageview]);

  return (
    <div>
      <HeroBanner
        breadcrumb={<CatalogBreadcrumb items={breadcrumbItems} />}
        description={<RichText raw={line?.abstract?.raw} />}
        image={
          line?.bannerImage?.gatsbyImageData && (
            <StyledImage
              loading="eager"
              alt={line?.lineName ?? ""}
              image={line.bannerImage.gatsbyImageData}
            />
          )
        }
        title={line?.lineName ?? ""}
      >
        {line?.catalog?.url && (
          <DownloadCatalogForm catalogId={line.lineName ?? ""} catalogUrl={line.catalog.url} />
        )}
      </HeroBanner>
      <Section>
        <CardGrid>
          {products.nodes?.map((product, i) => (
            <ProductCard
              key={i}
              product={product}
              actionLabel={labels["catalog-discover-button"]!}
              queryParams={queryParams}
              titleProps={{
                variant: "h2",
                size: "lg",
              }}
            />
          ))}
        </CardGrid>
      </Section>
    </div>
  );
};

export default ProductLineDetail;

export const Head: FC<
  HeadProps<Queries.LineDetailQuery, { language: string; material?: string }>
> = ({
  pageContext: { language, material },
  data: { contentfulLine: line, technologySlugs, materialSlugs, lineSlugs },
}) => {
  const technologyParams = technologySlugs.nodes.reduce(
    (acc, { slug, node_locale }) => ({ ...acc, [node_locale]: { technologySlug: slug } }),
    {} as any
  );
  const lineParams = lineSlugs.nodes.reduce(
    (acc, { slug, node_locale }) => ({ ...acc, [node_locale]: { slug } }),
    {} as any
  );
  const alternateParams = materialSlugs.nodes.reduce(
    (acc, { slug, node_locale }) => ({
      ...acc,
      [node_locale]: {
        ...technologyParams?.[node_locale],
        ...lineParams?.[node_locale],
        materialSlug: slug,
      },
    }),
    {} as any
  );
  return (
    <SEO
      htmlLang={language}
      title={line?.metaTitle ?? line?.lineName}
      description={line?.metaDescription}
      image={line?.bannerImage?.url}
      path={
        material
          ? "materials/{materialSlug}/{technologySlug}/{slug}"
          : "product-families/{technologySlug}/{slug}"
      }
      alternateParams={alternateParams}
    />
  );
};

export const query = graphql`
  query LineDetail(
    $slug: String
    $material: String
    $language: String
    $contentful_id: String
    $technologyContentful_id: String
    $materialContentful_id: String
  ) {
    lineSlugs: allContentfulLine(filter: { contentful_id: { eq: $contentful_id } }) {
      nodes {
        slug
        node_locale
      }
    }
    technologySlugs: allContentfulTechnology(
      filter: { contentful_id: { eq: $technologyContentful_id } }
    ) {
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
    contentfulLine(slug: { eq: $slug }, node_locale: { eq: $language }) {
      slug
      lineName
      metaTitle
      metaDescription
      originalEntry {
        lineName
      }
      catalog {
        url
      }
      abstract {
        raw
      }
      bannerImage {
        gatsbyImageData
        url
      }
      technology {
        slug
        technologyName
        originalEntry {
          technologyName
        }
      }
    }
    contentfulMaterial(slug: { eq: $material }, node_locale: { eq: $language }) {
      ...MaterialData
      materialName
      originalEntry {
        materialName
      }
    }
    allContentfulProduct(
      filter: {
        materials: { elemMatch: { slug: { eq: $material } } }
        lines: { elemMatch: { slug: { eq: $slug } } }
        node_locale: { eq: $language }
      }
      sort: { productCode: ASC }
    ) {
      nodes {
        ...ProductCard
      }
    }
  }
`;
