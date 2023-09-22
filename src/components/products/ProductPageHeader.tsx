import {
  Button,
  IconTabs,
  IconTabsProps,
  mqFrom,
  mqUntil,
  Title,
  VideoPlayer,
} from "@biesse-group/react-components";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC, useCallback, useState } from "react";
import styled, { css } from "styled-components";

import { useDataLayer } from "../../hooks/data-layer";
import { useLabels } from "../../hooks/useLabels";
import { DownloadCatalogForm } from "../forms/DownloadCatalogForm";
import { MaterialTag, MaterialTagProps } from "../MaterialTag";
import { Section } from "../Section";

export interface ProductPageHeaderProps {
  product: Queries.ContentfulProduct;
  breadcrumb?: JSX.Element;
  contactUsAction?: () => void;
}

const Root = styled.div`
  padding-top: 32px;
  padding-bottom: 20px;
  margin-bottom: 120px;
  ${mqUntil(
    "sm",
    css`
      margin-bottom: 80px;
    `
  )}
  background-color: ${(props) => props.theme.color.secondary};
  min-height: 420px;
`;

const SectionInner = styled.div`
  display: grid;
  grid-template:
    "breadcrumb breadcrumb breadcrumb"
    "info media tabs" / auto 1fr auto;
  width: 100%;

  ${mqUntil(
    "md",
    css`
      grid-template:
        "breadcrumb"
        "media"
        "tabs"
        "info" / auto;
      row-gap: 30px;
    `
  )}
`;

const InfoContainer = styled.div`
  grid-area: info;
`;

const StyledGatsbyImage = styled(GatsbyImage)`
  height: 100%;
  max-width: 100%;
`;

const ImageContainer = styled.div`
  height: 460px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const VideoPlayerContainer = styled.div`
  max-width: 100%;
  height: 100%;
`;

const MediaContainer = styled.div`
  grid-area: media;
  position: relative;

  ${mqFrom(
    "md",
    css`
      > ${ImageContainer}, > ${VideoPlayerContainer} {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      > ${ImageContainer} {
        padding: 0px 20px;
        max-width: 500px;
      }
      > ${VideoPlayerContainer} {
        padding: 20px 0;
        width: 100%;

        video {
          width: auto;
          max-width: 100%;
          max-height: 100%;
        }
      }
    `
  )};
`;

const ProductTitle = styled(Title)`
  margin-top: 50px;
  margin-bottom: 30px;

  ${mqUntil(
    "md",
    css`
      margin-top: 0;
    `
  )}
`;

const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 57px;
  column-gap: 13px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 260px;
  row-gap: 20px;

  ${mqUntil(
    "md",
    css`
      width: 100%;
    `
  )}
`;

const BreadcrumbContainer = styled.div`
  grid-area: breadcrumb;
  justify-self: start;
`;

const StyledTabs = styled(IconTabs)`
  grid-area: tabs;
  align-self: flex-end;

  ${mqFrom(
    "md",
    css`
      margin-bottom: 40px;
    `
  )}
`;

const MobileTabs = styled(StyledTabs)`
  justify-self: center;

  ${mqFrom(
    "md",
    css`
      display: none;
    `
  )}
`;

const DesktopTabs = styled(StyledTabs)`
  ${mqUntil(
    "md",
    css`
      display: none;
    `
  )}
`;

export const ProductPageHeader: FC<ProductPageHeaderProps> = ({
  product,
  breadcrumb,
  contactUsAction,
}) => {
  const productCode = product.productCode;
  const [selectedTab, setSelectedTab] = useState<string | number>("picture");

  const labels = useLabels([
    "product-compare-button",
    "product-download-catalog-button",
    "product-contact-us-button",
  ]);

  const tabsProps: IconTabsProps = {
    selected: selectedTab,
    onSelect: (id) => setSelectedTab(id),
    tabs: [
      {
        id: "picture",
        ariaLabel: "Picture",
        icon: "picture",
      },
      {
        id: "video",
        ariaLabel: "Video Pill",
        icon: "video-pill",
      },
    ],
  };

  const { pushEvent } = useDataLayer();
  const onClickDownloadCatalogue = useCallback(() => {
    pushEvent({
      event: "cta_product_catalogue",
      product_name: productCode,
    });
  }, [pushEvent, productCode]);

  const [isPlayTracked, setIsPlayTracked] = useState(false);

  return (
    <Root>
      <Section verticalSpace={false}>
        <SectionInner>
          <BreadcrumbContainer>{breadcrumb}</BreadcrumbContainer>
          <InfoContainer>
            <ProductTitle variant="h1" color="primary">
              {productCode}
            </ProductTitle>
            <TagsContainer>
              {product.materials?.map((material, index) => (
                <MaterialTag key={index} material={material?.key as MaterialTagProps["material"]} />
              ))}
            </TagsContainer>
            <ButtonsContainer>
              {/* TODO Uncomment when implementing product comparer */}
              {/* <Button variant="primary">{labels["product-compare-button"]}</Button> */}
              <Button variant="primary" onClick={contactUsAction}>
                {labels["product-contact-us-button"]}
              </Button>
              {product.catalog?.url && (
                <DownloadCatalogForm
                  onOpenModal={onClickDownloadCatalogue}
                  catalogUrl={product.catalog.url}
                  catalogId={productCode ?? ""}
                  buttonLabel={labels["product-download-catalog-button"] || ""}
                />
              )}
            </ButtonsContainer>
          </InfoContainer>
          <MediaContainer>
            {selectedTab === "picture"
              ? product.image?.gatsbyImageData && (
                  <ImageContainer>
                    <StyledGatsbyImage
                      loading="eager"
                      image={product.image.gatsbyImageData}
                      alt={productCode ?? ""}
                      objectFit="contain"
                    />
                  </ImageContainer>
                )
              : product.videoPill?.url && (
                  <VideoPlayerContainer>
                    <VideoPlayer
                      url={product.videoPill?.url}
                      autoPlay
                      loop
                      variant="fit"
                      onChangePlayStatus={(isPlaying) => {
                        if (isPlaying && !isPlayTracked) {
                          pushEvent({
                            event: "view_video",
                            video_name: product.productCode,
                          });
                          setIsPlayTracked(true);
                        }
                      }}
                    />
                  </VideoPlayerContainer>
                )}
          </MediaContainer>
          {product.videoPill && (
            <>
              <MobileTabs {...tabsProps} variant="horizontal" />
              <DesktopTabs {...tabsProps} />
            </>
          )}
        </SectionInner>
      </Section>
    </Root>
  );
};
