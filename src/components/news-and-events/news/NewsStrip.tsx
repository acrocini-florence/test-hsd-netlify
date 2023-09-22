import { StripThreeCols, StripThreeColsProps } from "@biesse-group/react-components";
import { graphql } from "gatsby";
import React, { FC } from "react";

import { NewsCard } from "./NewsCard";

export interface NewsStripProps {
  newsStrip: Queries.NewsStripFragment;
}

export const NewsStrip: FC<NewsStripProps> = ({ newsStrip }) => {
  try {
    if (!newsStrip.news || !newsStrip.news[0]) {
      throw new Error(
        "Something wen wrong with number of elements. \nContentful should not allow it."
      );
    }

    const items = newsStrip.news.map((element, index) => {
      if (element) {
        return <NewsCard news={element} titleSize={index > 0 ? "small" : "default"} key={index} />;
      } else {
        return undefined;
      }
    });
    return (
      <StripThreeCols
        title={newsStrip.title ?? ""}
        mobileBehavior="wrap"
        items={items as StripThreeColsProps["items"]}
      />
    );
  } catch (e) {
    return <></>;
  }
};

export const query = graphql`
  fragment NewsStrip on ContentfulNewsStrip {
    title
    news {
      ...NewsCard
    }
  }
`;
