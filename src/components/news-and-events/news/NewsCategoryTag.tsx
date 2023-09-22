import { Tag, TagProps } from "@biesse-group/react-components";
import React, { FC } from "react";

import { useLabels } from "../../../hooks/useLabels";

export interface NewsCategoryTagProps extends Pick<TagProps, "border"> {
  category: "corporate" | "products" | "events" | "exhibition";
}

export const NewsCategoryTag: FC<NewsCategoryTagProps> = ({ category, ...props }) => {
  const labels: Record<string, string | null> = useLabels([
    "news-category-corporate",
    "news-category-products",
    "news-category-events",
    "news-category-exhibitions",
  ]);

  return (
    <Tag color="secondary" {...props}>
      {labels[`news-category-${category}`]}
    </Tag>
  );
};
