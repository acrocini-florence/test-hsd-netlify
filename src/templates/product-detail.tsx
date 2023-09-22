import { Title, useRefWithCallback } from "@biesse-group/react-components";
import { graphql, HeadProps, PageProps } from "gatsby";
import React, { FC, useCallback, useEffect } from "react";

import { RelatedAccessories } from "../components/accessories/RelatedAccessories";
import { ProjectCard } from "../components/case-history/ProjectCard";
import { InterestFieldType } from "../components/forms/models/interest-field-type";
import { RequestInfoForm } from "../components/forms/RequestInfoForm";
import { EventStrip } from "../components/news-and-events/events/EventStrip";
import { ProductBreadcrumb } from "../components/products/ProductBreadcrumb";
import { ProductDetailRelated } from "../components/products/ProductDetailRelated";
import { ProductDetailSection } from "../components/products/ProductDetailSection";
import { ProductPageHeader } from "../components/products/ProductPageHeader";
import { ProductTechSheet } from "../components/products/ProductTechSheet";
import { Section } from "../components/Section";
import { SEO } from "../components/Seo/Seo";
import { useProductBreadcrumbs } from "../hooks/breadcrumbs/useProductBreadcrumbs";
import {
  PageType,
  PageviewEventProps,
  SiteArea,
  useDataLayer,
  useTrackPageview,
} from "../hooks/data-layer";
import { useLabels } from "../hooks/useLabels";

const ProductDetail: FC<PageProps<Queries.ProductDetailQuery>> = ({ data, location }) => {
  const { contentfulProduct: product, contentfulEventStrip: eventStrip } = data;
  const labels = useLabels([
    "product-case-history-title",
    "product-accessories-title",
    "product-technical-sheet-title",
    "product-discover-title",
    "product-related-title",
  ]);

  const technicalSheets = product?.childrenContentfulProductTechnicalSheetsJsonNode || [];

  const [infoFormRef, setInfoFormRef] = useRefWithCallback<HTMLDivElement>();

  const { pushEvent } = useDataLayer();
  const trackPageview = useTrackPageview();
  const productCode = product?.productCode;

  const handleOnContactUs = useCallback(() => {
    if (infoFormRef.current) {
      infoFormRef.current.scrollIntoView({ behavior: "smooth" });
      pushEvent({
        event: "cta_product_contact",
        product_name: productCode,
      });
    }
  }, [infoFormRef, pushEvent, productCode]);

  const { line, material, breadcrumbItems } = useProductBreadcrumbs({
    product: product as Queries.ContentfulProduct,
    queryParams: location.search,
  });

  useEffect(() => {
    if (breadcrumbItems.length) {
      const event: PageviewEventProps = {
        page_type: PageType.Product,
        site_area: SiteArea.Products,
        breadcrumbs: breadcrumbItems,
        material: material ?? null,
        line: line ?? null,
        technology: line?.technology ?? null,
      };
      trackPageview(event);
    }
  }, [breadcrumbItems, line, material, product, trackPageview]);

  useEffect(() => {
    pushEvent({
      event: "product_view",
      product_name: productCode,
    });
  }, [productCode, pushEvent]);

  return (
    <div>
      <ProductPageHeader
        contactUsAction={handleOnContactUs}
        product={product as Queries.ContentfulProduct}
        breadcrumb={<ProductBreadcrumb line={line} breadcrumbItems={breadcrumbItems} />}
      />
      {technicalSheets.length > 0 && (
        <ProductDetailSection subtitle={labels["product-technical-sheet-title"]} subtitleTag="h2">
          <ProductTechSheet
            sheets={technicalSheets as Queries.contentfulProductTechnicalSheetsJsonNode[]}
          />
        </ProductDetailSection>
      )}
      {product?.relatedAccessories && (
        <ProductDetailSection subtitle={labels["product-accessories-title"]} subtitleTag="h2">
          <RelatedAccessories
            accessories={product.relatedAccessories as Queries.ContentfulAccessory[]}
          />
        </ProductDetailSection>
      )}
      {product?.relatedProducts && (
        <ProductDetailSection
          title={labels["product-discover-title"]}
          subtitle={labels["product-related-title"]}
          $backgroundColor="lightGray"
        >
          <ProductDetailRelated
            relatedProducts={product.relatedProducts as Queries.ProductCardFragment[]}
            cardBackground="white"
          />
        </ProductDetailSection>
      )}
      {product?.caseHistory && (
        <Section>
          <div>
            <Title variant="h2" size="xxl" color="primary" uppercase>
              {labels["product-case-history-title"]}
            </Title>
            <ProjectCard project={product.caseHistory} direction="horizontal" />
          </div>
        </Section>
      )}
      {eventStrip && (
        <Section>
          <EventStrip eventStrip={eventStrip} />
        </Section>
      )}
      <RequestInfoForm
        pageType={PageType.Product}
        productCode={product?.productCode ?? null}
        ref={setInfoFormRef}
        defaultSelectedInterest={InterestFieldType.ESTIMATE_PRICE}
        style={{ marginBottom: 30 }}
      />
    </div>
  );
};

export default ProductDetail;

export const Head: FC<HeadProps<Queries.ProductDetailQuery, { language: string }>> = ({
  data: { contentfulProduct: product, slugs },
  pageContext: { language },
}) => {
  const alternateParams = slugs.nodes.reduce(
    (acc, { slug, node_locale }) => ({ ...acc, [node_locale]: { slug } }),
    {} as any
  );
  return (
    <SEO
      htmlLang={language}
      title={product?.metaTitle ?? product?.productCode}
      description={product?.metaDescription}
      image={product?.image?.url}
      path="products/{slug}"
      alternateParams={alternateParams}
    />
  );
};

export const query = graphql`
  query ProductDetail($slug: String, $language: String, $contentful_id: String) {
    slugs: allContentfulProduct(filter: { contentful_id: { eq: $contentful_id } }) {
      nodes {
        slug
        node_locale
      }
    }
    contentfulProduct(slug: { eq: $slug }, node_locale: { eq: $language }) {
      slug
      productCode
      originalEntry {
        productCode
      }
      image {
        gatsbyImageData
        url
      }
      metaTitle
      metaDescription
      lines {
        slug
        lineName
        originalEntry {
          lineName
        }
        technology {
          slug
          technologyName
          originalEntry {
            technologyName
          }
        }
      }
      materials {
        ...MaterialData
        materialName
        originalEntry {
          materialName
        }
      }
      catalog {
        url
      }
      childrenContentfulProductTechnicalSheetsJsonNode {
        productCode
        headerLabel
        technicalSheet {
          key
          value
        }
      }
      caseHistory {
        ...ProjectCard
      }
      relatedAccessories {
        image {
          gatsbyImageData
        }
        accessoryName
      }
      relatedProducts {
        ...ProductCard
      }
      videoPill {
        url
      }
    }

    contentfulEventStrip(handler: { eq: "homepage" }, node_locale: { eq: $language }) {
      ...EventStrip
    }
  }
`;
