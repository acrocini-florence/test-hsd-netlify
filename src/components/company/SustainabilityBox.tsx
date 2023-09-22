import { mqUntil, Title } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { useLabels } from "../../hooks/useLabels";
import { RichText } from "../RichText";
import { Section } from "../Section";
import { CompanyCard } from "./CompanyCard";
import { sortCompanyCard } from "./sort-company-cards";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 60px;
  grid-template-rows: 1fr;
  margin-top: 45px;
  ${mqUntil(
    "md",
    css`
      grid-template-rows: 1fr 1fr 1fr;
      grid-template-columns: 1fr;
    `
  )}
`;

const StyledRichText = styled(RichText)`
  text-align: center;

  ${mqUntil(
    "sm",
    css`
      text-align: start;
    `
  )}
`;

export interface SustainabilityBoxProps {
  className?: string;
  cards: readonly Queries.CompanyCardFragment[];
}

export const SustainabilityBox: FC<SustainabilityBoxProps> = ({ cards, ...props }) => {
  const labels = useLabels([
    "company-page-sustainability-title",
    "company-page-sustainability-abstract",
  ]);

  return (
    <Root {...props}>
      <Title variant="h2" size="sm" color="primary" style={{ marginBottom: "27px" }} uppercase>
        {labels["company-page-sustainability-title"]}
      </Title>
      <Section verticalSpace={false}>
        <StyledRichText raw={labels["company-page-sustainability-abstract"]} />
      </Section>
      {cards && (
        <CardWrapper>
          {sortCompanyCard([...cards]).map((card, i) => (
            <CompanyCard key={i} cardData={card} />
          ))}
        </CardWrapper>
      )}
    </Root>
  );
};
