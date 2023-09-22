import { graphql } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React, { FC } from "react";
import styled from "styled-components";

const Root = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  gap: 20px;
  grid-template-rows: 1fr;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
`;

const ImageWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-bottom-left-radius: ${(props) => props.theme.card.borderRadius};
  border-top-right-radius: ${(props) => props.theme.card.borderRadius};
`;

export interface CompanyHeaderImagesProps {
  className?: string;
  images?: [
    Nullable<Queries.CompanyHeaderImageFragment>,
    Nullable<Queries.CompanyHeaderImageFragment>
  ];
}

export const CompanyHeaderImages: FC<CompanyHeaderImagesProps> = ({ images, ...props }) => {
  return images ? (
    <Root {...props}>
      {images.map((image, i) =>
        image ? (
          <ImageWrapper key={i}>
            <GatsbyImage
              loading="eager"
              style={{ height: "100%" }}
              image={image.gatsbyImageData as IGatsbyImageData}
              alt={image.description ?? image.title ?? ""}
            />
          </ImageWrapper>
        ) : null
      )}
    </Root>
  ) : null;
};

export const query = graphql`
  fragment CompanyHeaderImage on ContentfulAsset {
    gatsbyImageData
    title
    description
  }
`;
