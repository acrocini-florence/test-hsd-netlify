import {
  Button,
  Input,
  Modal,
  mqUntil,
  Spinner,
  Text,
  Title,
  useModal,
} from "@biesse-group/react-components";
import axios from "axios";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";

import { DataLayerEvent, getHashedString, useDataLayer } from "../../../hooks/data-layer";
import { useLabels } from "../../../hooks/useLabels";
import { isEmailValid, useDebouncedStringValidation } from "../../../utils/forms";
import { CountrySelect } from "../CountrySelect";
import { FormButtons } from "../FormButtons";
import { GdprCheckbox } from "../GdprCheckbox";
import { RequestStatus } from "../GenericModalForm/request-status";
import { ModalFormContainer } from "../ModalFormContainer";
import { FormPayload } from "../models/form-payload";
import { formPayloadTitleMap, InterestFieldType } from "../models/interest-field-type";
import { allOf, Divider, getFormUrl, SpinnerContainer } from "../utils";

const InputGrid = styled.form`
  margin-top: 20px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 35px;
  row-gap: 15px;

  ${mqUntil(
    `sm`,
    css`
      grid-template-columns: 1fr;
    `
  )}
`;

const StyledButton = styled(Button)`
  ${mqUntil(
    "sm",
    css`
      font-size: 12px;
    `
  )}
`;

export interface DownloadCatalogFormProps {
  buttonLabel?: string;
  catalogId: string;
  catalogUrl: string;
  onOpenModal?: () => void;
}

export const DownloadCatalogForm: FC<DownloadCatalogFormProps> = ({
  buttonLabel,
  catalogId,
  catalogUrl,
  onOpenModal,
}) => {
  const [selectedNation, setSelectedNation] = useState<Queries.CountriesStatesCitiesJson>();
  const [requestStatus, setRequestStatus] = useState(RequestStatus.INITIAL);

  const [payload, setPayload] = useState<FormPayload>({
    requestTitle: formPayloadTitleMap[InterestFieldType.DOWNLOAD_CATALOG],
    requestMessage: `Download catalog ${catalogId}`,
  });

  const isEmailValidated = useDebouncedStringValidation(payload.email, isEmailValid);

  const isValid = useMemo(
    () =>
      !!payload.company &&
      !!payload.email &&
      !!isEmailValidated &&
      !!payload.country &&
      !!payload.consents &&
      allOf(payload.consents, ["marketing", "privacy"]),
    [payload, isEmailValidated]
  );

  const labels = useLabels([
    "info-form-name",
    "info-form-surname",
    "download-catalog-form-title",
    "download-catalog-form-description",
    "download-catalog-form-cancel",
    "download-catalog-form-confirm",
    "download-catalog-button",
    "info-form-email",
    "info-form-company",
  ]);

  const { pushEvent } = useDataLayer();
  const { email } = payload;
  const sendDownloadEvent = useCallback(() => {
    const hashedUserEmail = getHashedString(email);
    const event: DataLayerEvent = {
      event: "download_catalogue",
      user_email_md5: hashedUserEmail.md5,
      user_email_sha256: hashedUserEmail.sha256,
      catalogue_name: catalogId,
    };
    pushEvent(event);
  }, [email, pushEvent, catalogId]);

  const { isOpen, close, open } = useModal({
    onOpen: onOpenModal,
  });

  const handleDownload = useCallback(
    async (token: string) => {
      setRequestStatus(RequestStatus.PENDING);
      try {
        await axios.post(
          getFormUrl(),
          {
            ...payload,
            gRecaptchaResponse: token,
            leadSource: "Business Web Site",
          },
          {
            headers: {
              "client-id": process.env.GATSBY_MULE_CLIENT_ID,
              "client-secret": process.env.GATSBY_MULE_CLIENT_SECRET,
            },
          }
        );
        close();
        setRequestStatus(RequestStatus.SUCCESS);

        window.open(catalogUrl, "__blank");

        sendDownloadEvent();
      } catch (err) {
        console.error(err);
        close();
        setRequestStatus(RequestStatus.ERROR);
      }
    },
    [catalogUrl, close, payload, sendDownloadEvent]
  );

  useEffect(() => {
    if (!isOpen) {
      setPayload({
        requestTitle: formPayloadTitleMap[InterestFieldType.DOWNLOAD_CATALOG],
        requestMessage: `Download catalog ${catalogId}`,
      });
    } else if (onOpenModal) {
      onOpenModal();
    }
  }, [isOpen, onOpenModal, catalogId]);

  return (
    <>
      <StyledButton type="button" variant="primary-inverted" onClick={open} rightIcon="download">
        {buttonLabel || labels["download-catalog-button"]}
      </StyledButton>
      <Modal isOpen={isOpen} close={close}>
        {requestStatus === RequestStatus.PENDING ? (
          <SpinnerContainer>
            <Spinner />
          </SpinnerContainer>
        ) : (
          <ModalFormContainer>
            <Title color="light" style={{ marginBottom: "10px" }} variant="h3">
              {labels["download-catalog-form-title"]}
            </Title>
            <Text color="light">{labels["download-catalog-form-description"]}</Text>
            <InputGrid>
              <Input
                type="text"
                placeholder={`${labels["info-form-name"]}*`}
                onChange={(e) => setPayload({ ...payload, firstName: e.target.value })}
                shadow="dark"
              />
              <Input
                type="text"
                placeholder={`${labels["info-form-surname"]}*`}
                onChange={(e) => setPayload({ ...payload, lastName: e.target.value })}
                shadow="dark"
              />
              <Input
                type="text"
                placeholder={`${labels["info-form-company"]}*`}
                onChange={(e) => setPayload({ ...payload, company: e.target.value })}
                shadow="dark"
              />
              <Input
                type="email"
                error={payload.email && isEmailValidated === false}
                placeholder={`${labels["info-form-email"]}*`}
                onChange={(e) => setPayload({ ...payload, email: e.target.value })}
                shadow="dark"
              />
              <CountrySelect
                value={selectedNation}
                onChange={(country) => {
                  setSelectedNation(country);
                  setPayload({ ...payload, country: country.iso3 || "" });
                }}
              />
            </InputGrid>
            <Divider />
            <GdprCheckbox
              onChange={(id, checked) =>
                setPayload({ ...payload, consents: { ...payload.consents, [id]: checked } })
              }
            />
            <FormButtons
              cancelButton={{
                label: labels["download-catalog-form-cancel"] || "",
                onClick: close,
              }}
              confirmButton={{
                label: labels["download-catalog-form-confirm"] || "",
                disabled: !isValid,
                onClick: handleDownload,
              }}
            />
          </ModalFormContainer>
        )}
      </Modal>
    </>
  );
};
