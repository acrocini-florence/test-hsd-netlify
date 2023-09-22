import { IconName, Tag, TagProps } from "@biesse-group/react-components";
import { graphql } from "gatsby";
import React, { FC } from "react";

import { useLabels } from "../hooks/useLabels";

export interface MaterialTagProps extends Pick<TagProps, "border"> {
  material: Exclude<TagProps["color"], "primary" | "secondary">;
}

export const MaterialTag: FC<MaterialTagProps> = ({ material, ...props }) => {
  const labels = useLabels([
    "material-stone",
    "material-metal",
    "material-wood",
    "material-glass",
    "material-composite",
  ]);

  return (
    <Tag icon={`material-${material}` as IconName} color={material} {...props}>
      {labels[`material-${material}`]}
    </Tag>
  );
};

export const query = graphql`
  fragment MaterialData on ContentfulMaterial {
    slug
    key
  }
`;
