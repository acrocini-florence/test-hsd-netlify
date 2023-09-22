import { BaseProps, CtaCard } from "@biesse-group/react-components";
import { navigate } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC } from "react";
import styled from "styled-components";

import { useLocalizedPath } from "../../hooks/useLocalizedPath";
import { Link } from "../Link";
import { RichText } from "../RichText";

const StyledCtaCard = styled(CtaCard)`
  height: 130px;
`;

const StyledAbstract = styled(RichText)`
  line-height: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  /* line-clamp: 2 */
`;

const ImageContainer = styled.div`
  border-bottom-left-radius: ${(props) => props.theme.card.borderRadius};
  border-top-right-radius: ${(props) => props.theme.card.borderRadius};
  background-color: ${(props) => props.theme.color.secondary};
  overflow-y: visible;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 15px;
`;

interface Props extends BaseProps {
  product: Queries.ContentfulProduct;
}

export const RelatedProductCard: FC<Props> = ({ product, ...props }) => {
  const localizedPath = useLocalizedPath("products/{slug}", { slug: product.slug });

  return (
    <StyledCtaCard
      titleTag="h3"
      image={
        <ImageContainer>
          {product.image?.gatsbyImageData && (
            <GatsbyImage
              alt={product.productCode || ""}
              image={product.image.gatsbyImageData}
              style={{ height: "100%px", width: "80%" }}
              objectFit="contain"
            />
          )}
        </ImageContainer>
      }
      description={<StyledAbstract raw={product.description?.raw} />}
      variant="with-title"
      title={<Link to={localizedPath}>{product.productCode ?? ""}</Link>}
      onClick={() => navigate(localizedPath)}
      {...props}
    />
  );
};
