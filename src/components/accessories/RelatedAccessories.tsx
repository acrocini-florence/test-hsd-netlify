import React, { FC } from "react";

import { HorizontalScrollContainer } from "../HorizontalScrollContainer";
import { AccessoryCard } from "./AccessoryCard";

export interface RelatedAccessoriesProps {
  accessories: Queries.ContentfulAccessory[];
}

export const RelatedAccessories: FC<RelatedAccessoriesProps> = ({ accessories }) => {
  return (
    <HorizontalScrollContainer>
      {accessories.map((accessory, index) => (
        <AccessoryCard key={index} accessory={accessory} />
      ))}
    </HorizontalScrollContainer>
  );
};
