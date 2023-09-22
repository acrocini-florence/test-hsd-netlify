import { Button } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled from "styled-components";

import { useLabels } from "../../hooks/useLabels";
import { RichText } from "../RichText";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export interface BranchItemProps {
  className?: string;
  richText?: string;
  email?: string;
}

export const BranchItem: FC<BranchItemProps> = ({ richText, email, ...props }) => {
  const labels = useLabels(["contacts-ask-for-assistance-button"]);

  return (
    <Root {...props}>
      <RichText raw={richText} />
      <div style={{ marginTop: "20px" }}>
        <a href={`mailto:${email}`} rel="noreferrer">
          <Button variant="primary-naked" size="small" rightIcon="chevron-right">
            {labels["contacts-ask-for-assistance-button"]}
          </Button>
        </a>
      </div>
    </Root>
  );
};
