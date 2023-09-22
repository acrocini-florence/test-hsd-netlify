import React, { FC } from "react";
import styled from "styled-components";

import { useLabels } from "../../hooks/useLabels";
import { HorizontalScrollContainer } from "../HorizontalScrollContainer";
import { ProductCard, ProductCardProps } from "./ProductCard";

const StyledProductCard = styled(ProductCard)`
  flex: 0 1 calc(100% / 3);
  min-width: 300px;
`;

export interface ProductDetailRelatedProps {
  relatedProducts: Queries.ProductCardFragment[];
  cardBackground?: ProductCardProps["backgroundColor"];
}

export const ProductDetailRelated: FC<ProductDetailRelatedProps> = ({
  relatedProducts,
  cardBackground,
}) => {
  const labels = useLabels(["product-related-button-label"]);

  return (
    <HorizontalScrollContainer>
      {relatedProducts.map((relatedProduct, index) => (
        <StyledProductCard
          key={index}
          product={relatedProduct}
          actionLabel={labels["product-related-button-label"]!}
          backgroundColor={cardBackground}
          titleProps={{ size: "md" }}
        />
      ))}
    </HorizontalScrollContainer>
  );
};
