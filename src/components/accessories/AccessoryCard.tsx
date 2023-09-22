import { borderRadius, Text } from "@biesse-group/react-components";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC } from "react";
import styled from "styled-components";

const CardRoot = styled.div`
  padding-top: 50px;
  position: relative;
`;

const CardContent = styled.div`
  ${(props) => borderRadius(props.theme.card.borderRadius)}
  border: 1px solid ${(props) => props.theme.color.gray};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  min-height: 170px;
  width: 260px;
  flex: 0 0 230px;
  padding: 22px 28px;
  overflow: visible;
`;

const StyledGatsbyImage = styled(GatsbyImage)`
  width: 140px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

export interface AccessoryCardProps {
  accessory: Queries.ContentfulAccessory;
}

export const AccessoryCard: FC<AccessoryCardProps> = ({ accessory }) => {
  return (
    <CardRoot>
      {accessory.image?.gatsbyImageData && (
        <StyledGatsbyImage
          image={accessory.image.gatsbyImageData}
          alt={accessory.accessoryName || ""}
        />
      )}
      <CardContent>
        <Text weight="bold">{accessory.accessoryName}</Text>
      </CardContent>
    </CardRoot>
  );
};
