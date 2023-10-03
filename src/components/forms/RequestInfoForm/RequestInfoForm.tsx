import {
  Button,
  Modal,
  mqUntil,
  Select,
  Text,
  Textarea,
  Title,
  useModal,
} from "@biesse-group/react-components";
import React, { forwardRef, useCallback, useState } from "react";
import styled, { css, CSSProperties } from "styled-components";

import { mailtoConfig } from "../../../config/mailto-config";
import { DataLayerEvent, getHashedString, PageType, useDataLayer } from "../../../hooks/data-layer";
import { useLabels } from "../../../hooks/useLabels";
import { RichText } from "../../RichText";
import { GenericModalForm } from "../GenericModalForm";
import { FormPayload } from "../models/form-payload";
import {
  InterestFieldType,
  INTERESTS_FIELD_ITEMS_COMPLETE_VERSION,
  INTERESTS_FIELD_ITEMS_PARTIAL_VERSION,
} from "../models/interest-field-type";
import { mailTo } from "../utils";

const Container = styled.div`
  border-top-right-radius: ${(props) => props.theme.card.borderRadius};
  border-bottom-left-radius: ${(props) => props.theme.card.borderRadius};
  background-color: ${(props) => props.theme.color.primary};
  color: ${(props) => props.theme.color.white};
  display: flex;
  justify-content: center;
  padding: 55px 90px 45px;
  ${mqUntil(
    "sm",
    css`
      padding: 67px 30px 45px 30px;
    `
  )}
`;

const ContainerInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: ${(props) => props.theme.breakpoints.xxl}px;
  width: 100%;

  ${mqUntil(
    "md",
    css`
      flex-direction: column;
    `
  )}
`;

const InfoBox = styled.div`
  margin-right: 80px;
  flex: none;
  width: 440px;
  max-width: 100%;
`;

const StyledTitle = styled(Title)`
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SelectWrapper = styled.div`
  max-width: 350px;
`;

const StyledTextarea = styled(Textarea)`
  display: inline-flex;
  width: 100%;
  height: 100px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const StyledButton = styled(Button)`
  align-self: end;
`;

export interface RequestInfoFormProps {
  pageType: PageType;
  productCode: string | null;
  className?: string;
  style?: CSSProperties;
  defaultSelectedInterest?: InterestFieldType;
}

const maxChars = 600;

export const RequestInfoForm = forwardRef<HTMLDivElement, RequestInfoFormProps>(
  ({ defaultSelectedInterest, productCode, pageType, ...props }, selfRef) => {
    const [selectedInterestField, setSelectedInterestField] = useState<
      InterestFieldType | undefined
    >(defaultSelectedInterest);
    const [leadMessage, setLeadMessage] = useState<string>("");

    const labels: Record<string, string | null> = useLabels([
      "info-form-title",
      "info-form-interest-argument-placeholder",
      "info-form-message-placeholder",
      "info-form-available-characters",
      "info-form-open-form",
      "info-form-ask-for-more-info",
      "info-form-ask-for-estimated-price",
      "info-form-ask-for-assistance",
      "info-form-ask-for-hsd-demo",
      "info-form-become-a-provider",
      "info-form-modal-title",
      "info-form-request-success",
      "info-form-main-description",
      "info-form-modal-description",
    ]);

    const { pushEvent } = useDataLayer();
    const onOpenModal = useCallback(() => {
      const event: DataLayerEvent = {
        event: "form_come_possiamo_aiutarti",
        form_topic: selectedInterestField,
        page_type: pageType,
      };

      if (productCode) {
        event.product = productCode;
      }
      pushEvent(event);
    }, [pushEvent, productCode, pageType, selectedInterestField]);

    const { isOpen, close, open } = useModal({
      onOpen: onOpenModal,
    });

    const handleClose = (success?: boolean) => {
      close();
      if (success) {
        setLeadMessage("");
        setSelectedInterestField(defaultSelectedInterest);
      }
    };

    const onPostSuccess = useCallback(
      ({ email }: FormPayload) => {
        const hashedUserEmail = getHashedString(email);
        const event: DataLayerEvent = {
          event: "form_completa_richiesta",
          form_topic: selectedInterestField,
          user_email_md5: hashedUserEmail.md5,
          user_email_sha256: hashedUserEmail.sha256,
        };

        if (productCode) {
          event.product = productCode;
        }
        pushEvent(event);
      },
      [pushEvent, selectedInterestField, productCode]
    );

    const handleOpenButton = useCallback(() => {
      if (selectedInterestField === InterestFieldType.BECOME_PROVIDER) {
        mailTo({
          address: mailtoConfig.supplierAddress,
          subject: labels[`info-form-${InterestFieldType.BECOME_PROVIDER}`],
        });
      } else {
        open();
      }
    }, [selectedInterestField, labels, open]);

    return (
      <Container ref={selfRef} {...props}>
        <ContainerInner>
          <InfoBox>
            <StyledTitle variant="h2" size="md" color="light">
              {labels["info-form-title"]}
            </StyledTitle>
            <RichText variant="light" raw={labels["info-form-main-description"]} />
          </InfoBox>
          <Form>
            <SelectWrapper>
              <Select
                shadow="dark"
                placeholder={labels["info-form-interest-argument-placeholder"] || ""}
                aria-label="interest-argument"
                options={INTERESTS_FIELD_ITEMS_COMPLETE_VERSION.concat(
                  INTERESTS_FIELD_ITEMS_PARTIAL_VERSION
                ).map((e) => ({
                  label: labels[`info-form-${e}`] || e,
                  value: e,
                }))}
                value={selectedInterestField}
                onChange={(e) => setSelectedInterestField(e as InterestFieldType)}
              />
            </SelectWrapper>
            <StyledTextarea
              value={leadMessage}
              maxLength={maxChars}
              onChange={(e) => setLeadMessage(e.target.value)}
              shadow="dark"
              placeholder={labels["info-form-message-placeholder"] || ""}
            />
            <Text italic size="sm">
              {`${maxChars - leadMessage.length}/${maxChars} ${
                labels["info-form-available-characters"]
              }`}
            </Text>
            <StyledButton
              disabled={leadMessage === "" || !selectedInterestField}
              variant="primary-inverted"
              onClick={handleOpenButton}
            >
              {labels["info-form-open-form"]}
            </StyledButton>

            <Modal isOpen={isOpen} close={close}>
              <GenericModalForm
                title={labels["info-form-modal-title"] ?? ""}
                description={labels["info-form-modal-description"] ?? ""}
                successMessage={labels["info-form-request-success"] ?? ""}
                onClose={handleClose}
                onPostSuccess={onPostSuccess}
                leadMessage={leadMessage}
                interestFieldId={selectedInterestField}
              />
            </Modal>
          </Form>
        </ContainerInner>
      </Container>
    );
  }
);
