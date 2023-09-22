import { Button, mqUntil, Text, Title } from "@biesse-group/react-components";
import { graphql, navigate } from "gatsby";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { useDataLayer } from "../../hooks/data-layer";
import { useLabels } from "../../hooks/useLabels";
import { useLocalizedPath } from "../../hooks/useLocalizedPath";
import { UnstyledLink } from "../Link";
import { MaterialTag, MaterialTagProps } from "../MaterialTag";
import { RichText } from "../RichText";

const Root = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

const TagList = styled.div`
  margin-top: 20px;

  > *:not(:last-child) {
    margin-right: 10px;
  }
`;

const ButtonContainer = styled.div`
  margin-left: auto;
  display: flex;

  > button:not(:last-child) {
    margin-right: 20px;
  }

  ${mqUntil(
    "sm",
    css`
      order: 100;
      margin-left: 0;
      margin-top: 30px;
      flex: 0 0 100%;

      > button {
        flex: 1 1 50%;
      }
    `
  )}
`;

const labelsIds = ["product-details-button", "product-compare-button"];

export interface ProductCarouselDetailProps {
  product: Queries.ProductCarouselDataFragment;
}

export const ProductCarouselDetail: FC<ProductCarouselDetailProps> = ({ product }) => {
  const labels = useLabels(labelsIds);
  const originalLabels = useLabels(labelsIds, "en");

  const { pushEvent } = useDataLayer();

  const localizedProductPath = useLocalizedPath("products/{slug}", { slug: product.slug });

  return (
    <Root>
      <Title variant="h3" color="primary" style={{ margin: 0 }}>
        <UnstyledLink to={localizedProductPath}>{product.productCode}</UnstyledLink>
      </Title>
      <ButtonContainer>
        <Button
          variant="primary"
          onClick={() => {
            navigate(localizedProductPath);
            pushEvent({
              event: "select_promotion",
              nome_banner: product.productCode,
              codice_univoco_banner: product.contentful_id,
              tipo_banner: "products",
              cta_cliccata: originalLabels["product-details-button"],
            });
          }}
        >
          {labels["product-details-button"]}
        </Button>
        {/* TODO Uncomment when implementing product comparer */}
        {/* <Button variant="primary">{labels["product-compare-button"]}</Button> */}
      </ButtonContainer>
      <Text tag="p" color="primary" style={{ marginTop: 15, flex: "0 0 100%" }}>
        {product.lines?.[0]?.technology?.technologyName}
      </Text>
      <Content>
        <RichText raw={product.description?.raw} />
        <TagList>
          {product.materials?.map((tag, index) => (
            <MaterialTag
              material={tag?.key as MaterialTagProps["material"]}
              key={index}
              border={false}
            />
          ))}
        </TagList>
      </Content>
    </Root>
  );
};

export const query = graphql`
  fragment ProductCarouselData on ContentfulProduct {
    slug
    contentful_id
    productCode
    description {
      raw
    }
    materials {
      ...MaterialData
    }
    lines {
      technology {
        technologyName
      }
    }
    image {
      gatsbyImageData
      mimeType
      url
    }
  }
`;
