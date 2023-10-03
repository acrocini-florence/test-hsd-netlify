import { HeroCarousel, ProductCarousel } from "@biesse-group/react-components";
import { graphql, HeadProps, PageProps } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { ProjectStrip } from "../components/case-history/ProjectStrip";
import { RequestInfoForm } from "../components/forms/RequestInfoForm";
import { EventCard } from "../components/news-and-events/events/EventCard";
import { EventStrip } from "../components/news-and-events/events/EventStrip";
import { NewsStrip } from "../components/news-and-events/news/NewsStrip";
import { NewsletterStrip } from "../components/NewsletterStrip";
import { ProductCarouselDetail } from "../components/products/ProductCarouselDetail";
import { RichText } from "../components/RichText";
import { Section } from "../components/Section";
import { SEO } from "../components/Seo/Seo";
import { PageType, SiteArea, useDataLayer, useTrackPageview } from "../hooks/data-layer";
import { useOnBecomeVisible } from "../hooks/useOnBecomeVisible";
import { useOnCarouselItemVisible } from "../hooks/useOnCarouselItemVisible";

const HeroEventCard = styled(EventCard)`
  position: absolute;
  right: 0;
  top: 620px;
  z-index: 11;
`;

const IndexPage: FC<PageProps<Queries.HomepageQuery>> = ({ data }) => {
  const trackPageview = useTrackPageview();
  const { pushEvent } = useDataLayer();
  useEffect(() => {
    trackPageview({
      page_type: PageType.Home,
      site_area: SiteArea.Home,
      breadcrumbs: null,
      material: null,
      technology: null,
      line: null,
    });

    pushEvent({
      event: "home_view",
    });
  }, [pushEvent, trackPageview]);

  const heroCarouselContainer = useRef<HTMLDivElement>(null);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  useOnCarouselItemVisible(heroSlideIndex, heroCarouselContainer, () => {
    if (data?.contentfulHeroCarousel?.slides) {
      const slide = data.contentfulHeroCarousel.slides[heroSlideIndex];
      if (slide) {
        pushEvent({
          event: "view_promotion",
          nome_banner: slide?.originalEntry?.title ?? slide.title,
          entry_id: slide?.contentful_id,
          tipo_banner: "home",
        });
      }
    }
  });

  const productCarouselContainer = useRef<HTMLDivElement>(null);
  const [productPageIndex, setProductPageIndex] = useState(0);
  useOnCarouselItemVisible(productPageIndex, productCarouselContainer, () => {
    if (data?.contentfulProductCarousel?.products) {
      const product = data.contentfulProductCarousel.products[productPageIndex];
      if (product) {
        pushEvent({
          event: "view_promotion",
          nome_banner: product?.productCode,
          entry_id: product?.contentful_id,
          tipo_banner: "product",
        });
      }
    }
  });

  const newsContainer = useRef<HTMLDivElement>(null);
  useOnBecomeVisible(newsContainer, () => {
    data.contentfulNewsStrip?.news?.forEach((newsItem) => {
      if (newsItem) {
        pushEvent({
          event: "view_promotion",
          nome_banner: newsItem?.originalEntry?.title ?? newsItem.title,
          entry_id: newsItem.contentful_id,
          tipo_banner: "news",
        });
      }
    });
  });

  const handleHeroEventCardClick = useCallback(() => {
    pushEvent({
      event: "widget_fiere",
      nome_fiera: data.contentfulHeroCarousel?.highlightEvent?.eventName,
    });
  }, [pushEvent, data]);

  return (
    <>
      {data.contentfulHeroCarousel?.slides?.length && (
        <div style={{ position: "relative", marginBottom: "120px" }} ref={heroCarouselContainer}>
          <HeroCarousel
            onChangeSlide={setHeroSlideIndex}
            autoSlide={data.contentfulHeroCarousel.autoSlide || undefined}
            slides={data.contentfulHeroCarousel.slides.map((slide) => ({
              title: slide?.title ?? "",
              description: <RichText raw={slide?.description?.raw} variant="light" />,
              renderImage: () =>
                slide?.image?.gatsbyImageData && (
                  <GatsbyImage
                    loading="eager"
                    image={slide.image.gatsbyImageData}
                    alt={slide.title ?? ""}
                    style={{ width: "100%" }}
                    objectFit="cover"
                  />
                ),
            }))}
          />
          {data.contentfulHeroCarousel?.highlightEvent && (
            <HeroEventCard
              variant="hero"
              event={data.contentfulHeroCarousel.highlightEvent}
              onClick={handleHeroEventCardClick}
            />
          )}
        </div>
      )}
      {/* {data.contentfulPresentationStrip && (
        <Section>
          <PresentationStrip
            presentation={data.contentfulPresentationStrip as Queries.ContentfulPresentationStrip}
          />
        </Section>
      )} */}
      {/* {data.contentfulVideoBanner && (
        <Section horizontalSpace={false}>
          <VideoBanner
            title={data.contentfulVideoBanner.title!}
            subTitle={data.contentfulVideoBanner?.subtitle!}
            description={
              <RichText variant="light" raw={data.contentfulVideoBanner?.description!.raw!} />
            }
            video={{
              url: data.contentfulVideoBanner!.video!.url!,
              mimeType: data.contentfulVideoBanner!.video!.mimeType,
            }}
          />
        </Section>
      )} */}
      <div
        style={{ backgroundColor: "red", fontSize: "60px" }}
        onClick={() => {
          throw new Error("TEST SENTRY");
        }}
      >
        TEST ERROR
      </div>
      {data.contentfulProductCarousel?.products?.length && (
        <Section horizontalSpace={false} ref={productCarouselContainer}>
          <ProductCarousel<Queries.ContentfulProduct>
            onChangePage={setProductPageIndex}
            title={data.contentfulProductCarousel.title || ""}
            items={data.contentfulProductCarousel.products as Queries.ContentfulProduct[]}
            renderImage={(product) =>
              product.image?.gatsbyImageData && (
                <GatsbyImage
                  image={product.image.gatsbyImageData}
                  alt={product.productCode ?? ""}
                />
              )
            }
            renderTitle={(product) => product.productCode ?? ""}
            renderDetail={(product) => <ProductCarouselDetail product={product} />}
            contentHeight={300}
          />
        </Section>
      )}
      <Section horizontalSpace={false}>
        <RequestInfoForm pageType={PageType.Home} productCode={null} />
      </Section>
      {data.contentfulProjectStrip && (
        <Section>
          <ProjectStrip
            projectStrip={data.contentfulProjectStrip as Queries.ContentfulProjectStrip}
          />
        </Section>
      )}
      <Section horizontalSpace={false}>
        <NewsletterStrip />
      </Section>
      {/* {data.contentfulServiceStrip && (
        <Section>
          <ServiceStrip
            serviceStrip={data.contentfulServiceStrip as Queries.ContentfulServiceStrip}
          />
        </Section>
      )} */}
      {data.contentfulNewsStrip && (
        <Section ref={newsContainer}>
          <NewsStrip newsStrip={data.contentfulNewsStrip as Queries.ContentfulNewsStrip} />
        </Section>
      )}
      {data.contentfulEventStrip && (
        <Section>
          <EventStrip eventStrip={data.contentfulEventStrip} />
        </Section>
      )}
      {/* {data.contentfulPartnerCarousel?.partnersList?.length && (
        <PartnerCarousel carousel={data.contentfulPartnerCarousel} />
      )} */}
    </>
  );
};

export default IndexPage;

export const Head: FC<HeadProps<Queries.HomepageQuery, { language: string }>> = ({
  data: { contentfulPageMetadata: meta },
  pageContext: { language },
}) => {
  return (
    <SEO
      htmlLang={language}
      title={meta?.metaTitle}
      description={meta?.metaDescription}
      image={meta?.metaImage?.url}
      path="/"
      alternateParams={undefined}
    />
  );
};

export const query = graphql`
  query Homepage($language: String) {
    contentfulHeroCarousel(handler: { eq: "homepage" }, node_locale: { eq: $language }) {
      slides {
        contentful_id
        title
        originalEntry {
          title
        }
        description {
          raw
        }
        image {
          gatsbyImageData
          mimeType
          url
        }
      }
      autoSlide
      highlightEvent {
        ...EventCard
      }
    }

    contentfulProductCarousel(handler: { eq: "homepage" }, node_locale: { eq: $language }) {
      title
      products {
        ...ProductCarouselData
      }
    }

    # contentfulPresentationStrip(handler: { eq: "homepage" }, node_locale: { eq: $language }) {
    #   ...PresentationStrip
    # }

    # contentfulVideoBanner(handler: { eq: "homepage" }, node_locale: { eq: $language }) {
    #   subtitle
    #   title
    #   description {
    #     raw
    #   }
    #   video {
    #     url
    #     mimeType
    #   }
    # }

    # contentfulPartnerCarousel(handler: { eq: "homepage" }, node_locale: { eq: $language }) {
    #   ...PartnerCarousel
    # }

    contentfulEventStrip(handler: { eq: "homepage" }, node_locale: { eq: $language }) {
      ...EventStrip
    }

    contentfulNewsStrip(handler: { eq: "homepage" }, node_locale: { eq: $language }) {
      ...NewsStrip
    }

    contentfulProjectStrip(handler: { eq: "homepage" }, node_locale: { eq: $language }) {
      ...ProjectStrip
    }

    # contentfulServiceStrip(handler: { eq: "homepage" }, node_locale: { eq: $language }) {
    #   ...ServiceStrip
    # }

    contentfulPageMetadata(handler: { eq: "homepage" }, node_locale: { eq: $language }) {
      ...Metadata
    }
  }
`;
