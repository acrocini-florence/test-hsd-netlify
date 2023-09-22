import { mqUntil } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { useLabels } from "../../hooks/useLabels";
import { CtaCardList } from "../CtaCardList";
import { RelatedPartnerCard } from "../partners/RelatedPartnerCard";
import { RelatedProductCard } from "../products/RelatedProductCard";

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  gap: 60px;

  ${mqUntil(
    "sm",
    css`
      grid-template-columns: 1fr;
    `
  )}
`;

export interface CaseHistoryRelatedProps {
  products?: Queries.ContentfulProduct[];
  partners?: Queries.ContentfulPartner[];
}

export const CaseHistoryRelated: FC<CaseHistoryRelatedProps> = ({
  products,
  partners,
  ...props
}) => {
  const labels = useLabels([
    "project-page-linked-partners-title",
    "project-page-linked-products-title",
  ]);

  if (!products?.length && !partners?.length) {
    return <></>;
  }

  return (
    <Root {...props}>
      {products?.length && (
        <CtaCardList
          title={labels["project-page-linked-products-title"] ?? ""}
          items={products || []}
          renderItem={(product, key) => <RelatedProductCard {...{ product, key }} />}
        />
      )}
      {partners?.length && (
        <CtaCardList
          title={labels["project-page-linked-partners-title"] ?? ""}
          items={partners || []}
          renderItem={(partner, key) => <RelatedPartnerCard {...{ partner, key }} />}
        />
      )}
    </Root>
  );
};
