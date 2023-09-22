import { Checkbox, Text } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled from "styled-components";

import { useLabels } from "../../hooks/useLabels";
import { RichText } from "../RichText";
import { FormConsentsKeys } from "./models/form-payload";

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const GdprGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 20px;
  margin-top: 15px;
  margin-bottom: 60px;
  padding: 0px 20px;
`;

const StyledRichText = styled(RichText)`
  a {
    color: ${(props) => props.theme.color.white};
    text-decoration: underline;
  }
`;

export interface GdprCheckboxProps {
  className?: string;
  onChange?: (id: FormConsentsKeys, accepted: boolean) => void;
}

const checkboxes: { id: FormConsentsKeys; label: string }[] = [
  {
    id: "privacy",
    label: "gdpr-consensus-check1",
  },
  {
    id: "marketing",
    label: "gdpr-consensus-check2",
  },
  {
    id: "communication",
    label: "gdpr-consensus-check3",
  },
];

export const GdprCheckbox: FC<GdprCheckboxProps> = ({ onChange, ...props }) => {
  const labels: Record<string, string | null> = useLabels([
    "gdpr-consensus-title",
    "gdpr-consensus-check1",
    "gdpr-consensus-check2",
    "gdpr-consensus-check3",
  ]);

  return (
    <Root {...props}>
      <Text color="light">{labels["gdpr-consensus-title"]}</Text>
      <GdprGrid>
        {checkboxes.map(({ id, label }, i) => (
          <Checkbox
            key={i}
            inputId={id}
            label={<StyledRichText variant="light" raw={labels[label]} />}
            onChange={(newValue) => onChange?.(id, newValue)}
          />
        ))}
      </GdprGrid>
    </Root>
  );
};
