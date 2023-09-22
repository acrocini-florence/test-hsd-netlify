import { Button, Icon, mqUntil, Title } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { useLabels } from "../../hooks/useLabels";
import { RichText } from "../RichText";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledRichText = styled(RichText)`
  margin-bottom: 50px;
  text-align: center;

  ${mqUntil(
    "sm",
    css`
      text-align: start;
    `
  )}
`;

export interface CompanyServiceNetworkSectionProps {
  className?: string;
  action?: () => void;
}

export const CompanyServiceNetworkSection: FC<CompanyServiceNetworkSectionProps> = ({
  action,
  ...props
}) => {
  const labels = useLabels([
    "company-page-service-network-title",
    "company-page-service-network-button",
    "company-page-service-network-subtitle",
    "company-page-service-network-abstract",
  ]);

  return (
    <Root {...props}>
      <Icon name="company-network" color="primary" size="65px" />
      <Title variant="h2" size="sm" color="primary" style={{ margin: "8px 0px" }} uppercase>
        {labels["company-page-service-network-title"]}
      </Title>
      <Title
        variant="h3"
        size="xs"
        color="primary"
        style={{ marginBottom: "22px" }}
        uppercase={false}
      >
        {labels["company-page-service-network-subtitle"]}
      </Title>
      <StyledRichText raw={labels["company-page-service-network-abstract"]} />
      <Button onClick={action} variant="primary">
        {labels["company-page-service-network-button"]}
      </Button>
    </Root>
  );
};
