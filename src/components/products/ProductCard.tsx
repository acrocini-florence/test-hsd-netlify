import { borderRadius, Button, Title, type TitleProps } from "@biesse-group/react-components";
import { graphql, navigate } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC } from "react";
import styled from "styled-components";

import { useLocalizedPath } from "../../hooks/useLocalizedPath";
import { actionHoverTransition } from "../../styles";
import { UnstyledLink } from "../Link";

const StyledButton = styled(Button)``;

const Root = styled.div<{ $bg: ProductCardProps["backgroundColor"] }>`
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.5s ease-out;
  cursor: pointer;
  background-color: ${({ theme, $bg }) => theme.color[$bg || "lightGray"]};
  ${(props) => borderRadius(props.theme.card.borderRadius)}

  :hover {
    box-shadow: ${(props) => props.theme.card.boxShadow};
    background-color: ${({ theme }) => theme.color.white};

    ${StyledButton} {
      ${actionHoverTransition}
    }
  }
`;

const ImageBackground = styled.div`
  flex: none;
  background-color: ${({ theme }) => theme.color.secondary};
  ${(props) => borderRadius(props.theme.card.borderRadius)}
  height: 230px;
  margin-bottom: 80px;
`;

const ImageWrapper = styled.div`
  position: absolute;
  display: flex;
  height: 300px;
  width: 100%;
  top: 20px;
  left: 0;
  justify-content: center;
  align-items: center;
`;

const StyledTitle = styled(Title)`
  flex: none;
  word-wrap: break-word;
  margin: 0px 28px 43px 28px;
`;

const CardFooter = styled.div`
  position: absolute;
  right: 20px;
  bottom: 12px;
`;

export interface ProductCardProps {
  className?: string;
  /**
   * Product card button label
   */
  actionLabel?: string;
  /**
   * Product data
   */
  product: Queries.ProductCardFragment;
  /**
   * Card background color
   */
  backgroundColor?: "white" | "lightGray";
  queryParams?: string;
  titleProps?: Partial<TitleProps>;
}

export const ProductCard: FC<ProductCardProps> = ({
  queryParams,
  actionLabel,
  product,
  titleProps,
  backgroundColor,
  ...props
}) => {
  const productPath = useLocalizedPath("products/{slug}", { slug: product.slug });
  const localizedPath = `${productPath}${queryParams ? `?${queryParams}` : ""}`;

  return (
    <Root $bg={backgroundColor} onClick={() => navigate(localizedPath)} {...props}>
      {product.image?.gatsbyImageData && (
        <ImageWrapper>
          <GatsbyImage
            alt={product.productCode ?? ""}
            image={product.image.gatsbyImageData}
            imgStyle={{ objectFit: "contain" }}
            style={{ height: "100%" }}
          />
        </ImageWrapper>
      )}
      <ImageBackground />
      <StyledTitle size="xl" color="primary" variant="h3" {...titleProps}>
        <UnstyledLink to={localizedPath}>{product.productCode}</UnstyledLink>
      </StyledTitle>
      <CardFooter>
        <StyledButton variant="primary-naked" size="small" rightIcon="chevron-right">
          {actionLabel}
        </StyledButton>
      </CardFooter>
    </Root>
  );
};

export const query = graphql`
  fragment ProductCard on ContentfulProduct {
    productCode
    slug
    image {
      gatsbyImageData
    }
  }
`;
