import { Button, ButtonProps, mqUntil } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { CaptchaButton, CaptchaButtonProps } from "../captcha/CaptchaButton";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  > * {
    flex: 0 1 45%;
  }
  ${mqUntil(
    `sm`,
    css`
      flex-direction: column-reverse;
      gap: 20px;
      > * {
        flex: unset;
      }
    `
  )}
`;

interface CancelButtonProps extends Pick<ButtonProps, "onClick"> {
  label: string;
}

interface confirmButtonProps extends Pick<CaptchaButtonProps, "onClick" | "disabled"> {
  label: string;
}

export interface FormButtonsProps {
  confirmButton: confirmButtonProps;
  cancelButton: CancelButtonProps;
}

export const FormButtons: FC<FormButtonsProps> = ({ confirmButton, cancelButton }) => {
  return (
    <ButtonContainer>
      <Button variant="outline-inverted" size="large" onClick={cancelButton.onClick}>
        {cancelButton.label}
      </Button>
      <CaptchaButton
        disabled={confirmButton.disabled}
        onClick={confirmButton.onClick}
        variant="primary-inverted"
        size="large"
      >
        {confirmButton.label}
      </CaptchaButton>
    </ButtonContainer>
  );
};
