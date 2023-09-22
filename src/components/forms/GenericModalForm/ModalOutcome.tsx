import { Button, Spinner, Title } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled from "styled-components";

import { useLabels } from "../../../hooks/useLabels";
import { RichText } from "../../RichText";
import { SpinnerContainer } from "../utils";
import { RequestStatus } from "./request-status";

const OutcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export interface ModalOutcomeProps {
  requestStatus: RequestStatus.SUCCESS | RequestStatus.ERROR | RequestStatus.PENDING;
  successMessage: string;
  onClose?: () => void;
}

export const ModalOutcome: FC<ModalOutcomeProps> = ({ requestStatus, successMessage, onClose }) => {
  const labels = useLabels([
    "info-form-error-title",
    "info-form-close-button",
    "info-form-error-description",
  ]);

  return requestStatus === RequestStatus.PENDING ? (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  ) : (
    <OutcomeContainer>
      <>
        <Title variant="h2" color="light">
          {requestStatus === RequestStatus.SUCCESS
            ? successMessage
            : labels["info-form-error-title"]}
        </Title>
        {requestStatus === RequestStatus.ERROR && (
          <RichText
            raw={labels["info-form-error-description"]}
            variant="light"
            style={{ textAlign: "center" }}
          />
        )}
        <Button
          variant="primary-inverted"
          size="large"
          style={{ marginTop: 40, flex: "0 0 auto" }}
          onClick={onClose}
        >
          {labels["info-form-close-button"]}
        </Button>
      </>
    </OutcomeContainer>
  );
};
