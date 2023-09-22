import { Button, Modal, Title, useModal } from "@biesse-group/react-components";
import React, { FC, useCallback } from "react";
import styled from "styled-components";

import { mailtoConfig } from "../config/mailto-config";
import { useDataLayer, useTrackNewsletterSubscription } from "../hooks/data-layer";
import { useLabels } from "../hooks/useLabels";
import { GenericModalForm } from "./forms/GenericModalForm/GenericModalForm";
import { InterestFieldType } from "./forms/models/interest-field-type";
import { RichText } from "./RichText";
import { Section } from "./Section";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 30px;
  justify-content: space-between;
  height: 100%;
  border-bottom-left-radius: ${(props) => props.theme.card.borderRadius};
  border-top-right-radius: ${(props) => props.theme.card.borderRadius};
  background-color: ${(props) => props.theme.color.primary};
`;

const StyledTitle = styled(Title)`
  margin-bottom: 10px;
  text-align: center;
`;

const StyledRichText = styled(RichText)`
  text-align: center;
  font-size: ${(props) => props.theme.font.regular.body.xl};
  line-height: 32px;
`;

export const NewsletterStrip: FC<{ className?: string }> = ({ ...props }) => {
  const labels = useLabels([
    "newsletter-box-button",
    "newsletter-box-title",
    "newsletter-form-title",
    "newsletter-form-subscription-success",
    "newsletter-box-description",
    "newsletter-form-description",
  ]);

  const onPostSuccess = useTrackNewsletterSubscription();

  const { pushEvent } = useDataLayer();
  const onOpenModal = useCallback(() => {
    pushEvent({
      event: "banner_selection",
      nome_banner: "newsletter",
      tipo_banner: "newsletter",
      cta_cliccata: "subscribe",
    });
  }, [pushEvent]);

  const { isOpen, close, open } = useModal({
    onOpen: onOpenModal,
  });

  return (
    <Root {...props}>
      <Section verticalSpace={false}>
        <div>
          <StyledTitle variant="h2" size="sm" color="light" uppercase>
            {labels["newsletter-box-title"]}
          </StyledTitle>
          <StyledRichText variant="light" raw={labels["newsletter-box-description"]} />
        </div>
      </Section>
      <Section verticalSpace={false} style={{ marginTop: 30 }}>
        <Button variant="primary-inverted" onClick={open}>
          {labels["newsletter-box-button"]}
        </Button>
        <Modal isOpen={isOpen} close={close}>
          <GenericModalForm
            onPostSuccess={onPostSuccess}
            title={labels["newsletter-form-title"] || ""}
            description={labels["newsletter-form-description"] || ""}
            interestFieldId={InterestFieldType.NEWSLETTER}
            onClose={close}
            successMessage={labels["newsletter-form-subscription-success"] || ""}
            leadMessage={"Newsletter subscription"}
            mailAddress={mailtoConfig.newsletterAddress}
          />
        </Modal>
      </Section>
    </Root>
  );
};
