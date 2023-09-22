import { Checkbox, mqUntil } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { useLabels } from "../../hooks/useLabels";
import { FormMaterials } from "./models/form-payload";

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  column-gap: 10px;
  row-gap: 10px;
  margin-top: 10px;
  margin-bottom: 40px;
  padding: 0px 20px;

  ${mqUntil(
    `md`,
    css`
      grid-template-columns: 1fr auto;
    `
  )}

  ${mqUntil(
    `sm`,
    css`
      grid-template-columns: 1fr;
    `
  )}
`;

const checkboxes: { id: FormMaterials; label: string }[] = [
  {
    id: FormMaterials.ALUMINIUM,
    label: "info-form-aluminum-profile",
  },
  {
    id: FormMaterials.GLASS_STONE,
    label: "info-form-glass-stone",
  },
  {
    id: FormMaterials.METAL,
    label: "info-form-metal",
  },
  {
    id: FormMaterials.PLASTIC_COMPOSITE,
    label: "info-form-plastic-composite",
  },
  {
    id: FormMaterials.OTHER,
    label: "info-form-other",
  },
  {
    id: FormMaterials.WOOD,
    label: "info-form-wood",
  },
];

export interface MaterialsFormProps {
  className?: string;
  onCheckChange?: (id: FormMaterials, value: boolean) => void;
}

export const MaterialsForm: FC<MaterialsFormProps> = ({ onCheckChange, ...props }) => {
  const labels: Record<string, string | null> = useLabels([
    "info-form-aluminum-profile",
    "info-form-glass-stone",
    "info-form-metal",
    "info-form-plastic-composite",
    "info-form-other",
    "info-form-wood",
  ]);

  return (
    <Root {...props}>
      {checkboxes.map(({ id, label }, i) => (
        <Checkbox
          key={i}
          inputId={id}
          label={labels[label] || ""}
          onChange={(e) => onCheckChange && onCheckChange(id, e)}
        />
      ))}
    </Root>
  );
};
