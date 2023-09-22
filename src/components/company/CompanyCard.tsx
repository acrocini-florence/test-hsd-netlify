import { Button, IconCard } from "@biesse-group/react-components";
import { graphql } from "gatsby";
import React, { FC } from "react";

import { useDataLayer } from "../../hooks/data-layer";
import { ContentfulImage } from "../ContentfulImage";
import { RichText } from "../RichText";

export interface CompanyCardProps {
  className?: string;
  cardData: Queries.CompanyCardFragment;
}

export const CompanyCard: FC<CompanyCardProps> = ({ cardData, ...props }) => {
  const { pushEvent } = useDataLayer();
  const handleAction = () => {
    if (cardData.certification?.url) {
      pushEvent({
        event: "download_certificate",
        certificate_name: cardData.certification.title,
      });
      window.open(cardData.certification.url, "__blank");
    }
  };
  return (
    <IconCard
      style={{ height: "100%" }}
      action={
        <Button variant="primary" onClick={handleAction}>
          {cardData.buttonLabel}
        </Button>
      }
      description={<RichText raw={cardData.abstract?.raw} style={{ margin: "30px 0px" }} />}
      title={cardData.title ?? ""}
      subtitle={cardData.subtitle ?? ""}
      icon={
        cardData.icon ? (
          <ContentfulImage
            image={cardData.icon as Queries.ContentfulAsset}
            alt={cardData.title ?? ""}
            style={{ height: 100 }}
          />
        ) : (
          <></>
        )
      }
      {...props}
    />
  );
};

export const query = graphql`
  fragment CompanyCard on ContentfulPresentationCard {
    title
    subtitle
    handler
    icon {
      gatsbyImageData
      mimeType
      url
    }
    abstract {
      raw
    }
    buttonLabel
    certification {
      title
      url
    }
  }
`;
