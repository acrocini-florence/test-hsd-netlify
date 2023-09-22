import { mqUntil, Title } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { useLabels } from "../../hooks/useLabels";
import { Background } from "./Background";
import { Branches, branchesList, branchesMap } from "./branches-map";
import { BranchItem } from "./BranchItem";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const WrapperGrid = styled.div`
  position: relative;
  z-index: 10;
  padding: 25px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto auto;
  column-gap: 10px;
  grid-template-areas: "hq branches";
  ${mqUntil(
    "sm",
    css`
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      grid-auto-rows: auto;
      grid-template-areas: "hq" "." "." "branches";
      grid-auto-flow: dense;
      row-gap: 25px;
      padding: 0px;
    `
  )}
`;

const SubGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  column-gap: 10px;
  row-gap: 50px;
  ${mqUntil(
    "sm",
    css`
      grid-template-columns: 1fr;
      grid-auto-rows: auto;
    `
  )}
`;

const MobileDivider = styled.hr`
  display: none;
  ${mqUntil(
    "sm",
    css`
      width: 100%;
      display: block;
      grid-template-columns: 1fr;
      grid-auto-rows: auto;
    `
  )}
`;

const StyledBackground = styled(Background)`
  position: absolute;
  width: 100%;
  ${mqUntil(
    "sm",
    css`
      display: none;
    `
  )}
`;

const BranchSubtitle = styled(Title)`
  margin-bottom: 10px;
  font-size: 18px;
`;

export interface BranchesGridProps {
  className?: string;
}

export const BranchesGrid: FC<BranchesGridProps> = ({ ...props }) => {
  const labels = useLabels([
    "contacts-headquarter",
    "contacts-usa-branch",
    "contacts-korea-branch",
    "contacts-germany-branch",
    "contacts-taiwan-branch",
    "contacts-shanghai-branch",
    "contacts-body-main-title",
    "contacts-headquarter-subtitle",
    "contacts-branches-subtitle",
  ]);

  return (
    <Root {...props}>
      <Title variant="h3" size="sm" color="primary" uppercase>
        {labels["contacts-body-main-title"]}
      </Title>
      <div style={{ position: "relative" }}>
        <StyledBackground />
        <WrapperGrid>
          <BranchSubtitle variant="h4" style={{ gridArea: "hq" }}>
            {labels["contacts-headquarter-subtitle"]}
          </BranchSubtitle>
          <BranchSubtitle variant="h4" style={{ gridArea: "branches" }}>
            {labels["contacts-branches-subtitle"]}
          </BranchSubtitle>
          <BranchItem
            richText={labels[`contacts-${Branches.HEADQUARTER}`] ?? ""}
            email={branchesMap[Branches.HEADQUARTER]}
          />
          <MobileDivider />
          <SubGrid>
            {branchesList
              .filter((b) => b !== Branches.HEADQUARTER)
              .map((branch, i) => (
                <BranchItem
                  key={i}
                  richText={labels[`contacts-${branch}`] ?? ""}
                  email={branchesMap[branch]}
                />
              ))}
          </SubGrid>
        </WrapperGrid>
      </div>
    </Root>
  );
};
