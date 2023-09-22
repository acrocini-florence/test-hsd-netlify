import { BaseProps, CtaCard } from "@biesse-group/react-components";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC } from "react";
import styled from "styled-components";

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
  -webkit-line-clamp: 4;
  /* line-clamp: 4 */
`;

interface Props extends BaseProps {
  partner: Queries.ContentfulPartner;
}

export const RelatedPartnerCard: FC<Props> = ({ partner, ...props }) => {
  const partnerEl = (
    <StyledCtaCard
      variant="full-image"
      title={null}
      description={<StyledAbstract raw={partner.abstract?.raw} />}
      titleTag="h3"
      image={
        partner.logo?.gatsbyImageData && (
          <GatsbyImage
            style={{ maxHeight: "100%", maxWidth: "100%" }}
            alt={partner.name || ""}
            image={partner.logo.gatsbyImageData}
            objectFit="contain"
          />
        )
      }
      {...props}
    />
  );
  return partner.externalUrl ? (
    <a href={partner.externalUrl} target="_blank" rel="noreferrer">
      {partnerEl}
    </a>
  ) : (
    partnerEl
  );
};
