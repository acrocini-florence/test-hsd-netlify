import { Input, Text, Title } from "@biesse-group/react-components";
import axios from "axios";
import React, { FC, useCallback, useMemo, useState } from "react";

import { useLabels } from "../../../hooks/useLabels";
import { isEmailValid, isMobileValid, useDebouncedStringValidation } from "../../../utils/forms";
import { RichText } from "../../RichText";
import { CountrySelect } from "../CountrySelect";
import { FormButtons } from "../FormButtons";
import { GdprCheckbox } from "../GdprCheckbox";
import { MaterialsForm } from "../MaterialsCheckbox";
import { ModalFormContainer } from "../ModalFormContainer";
import { FormMaterials, FormPayload } from "../models/form-payload";
import {
  formPayloadTitleMap,
  InterestFieldType,
  INTERESTS_FIELD_ITEMS_COMPLETE_VERSION,
  INTERESTS_FIELD_ITEMS_EVENT_VERSION,
} from "../models/interest-field-type";
import { allOf, Divider, getFormUrl } from "../utils";
import { InputGrid } from "./InputGrid";
import { ModalOutcome } from "./ModalOutcome";
import { RequestStatus } from "./request-status";

export interface GenericModalFormProps {
  interestFieldId?: InterestFieldType;
  onPostSuccess?: (payload: FormPayload) => void;
  leadMessage: string;
  mailTitle?: string;
  mailAddress?: string;
  title: string;
  description?: string | null;
  className?: string;
  onClose?: (success?: boolean) => void;
  successMessage?: string;
}

export const GenericModalForm: FC<GenericModalFormProps> = ({
  leadMessage,
  interestFieldId,
  onClose,
  title,
  description,
  successMessage = "",
  onPostSuccess,
  mailTitle,
  mailAddress,
  ...props
}) => {
  const [payload, setPayload] = useState<FormPayload>({
    requestTitle: formPayloadTitleMap[interestFieldId ?? "undefined"],
    requestMessage: leadMessage,
  });
  const [selectedNation, setSelectedNation] = useState<Queries.CountriesStatesCitiesJson>();
  const [requestStatus, setRequestStatus] = useState(RequestStatus.INITIAL);

  const labels = useLabels([
    "info-form-name",
    "info-form-city",
    "info-form-surname",
    "info-form-email",
    "info-form-mobile",
    "info-form-company",
    "info-form-materials-title",
    "info-form-back",
    "info-form-send-request-button",
  ]);

  const handlePost = useCallback(
    async (token: string) => {
      setRequestStatus(RequestStatus.PENDING);
      try {
        await axios.post(
          getFormUrl(),
          { ...payload, gRecaptchaResponse: token, leadSource: "Business Web Site" },
          {
            headers: {
              "client-id": process.env.GATSBY_MULE_CLIENT_ID,
              "client-secret": process.env.GATSBY_MULE_CLIENT_SECRET,
            },
          }
        );

        setRequestStatus(RequestStatus.SUCCESS);
        onPostSuccess?.(payload);
      } catch (e) {
        console.error(e);
        setRequestStatus(RequestStatus.ERROR);
      }
    },
    [payload, onPostSuccess]
  );

  const isCompleteVersion =
    !!interestFieldId &&
    [
      ...INTERESTS_FIELD_ITEMS_COMPLETE_VERSION,
      ...INTERESTS_FIELD_ITEMS_EVENT_VERSION,
      InterestFieldType.ASSISTANCE,
    ].includes(interestFieldId);

  /*
    quick fix for having validation with debounce, if any further development is needed we should
    consider using some form library like React Hook Form and refactor this part
  */
  const isEmailValidated = useDebouncedStringValidation(payload.email, isEmailValid);
  const isNumberValidated = useDebouncedStringValidation(payload.mobile, isMobileValid);

  const isSendEnabled = useMemo<boolean>(() => {
    const isMaterialChecked = !!payload.materials?.length;

    const mandatoryFields = allOf(payload, [
      "email",
      "mobile",
      "country",
      "city",
      "company",
      "firstName",
      "lastName",
    ]);

    const isGdprAccepted = !!payload.consents && allOf(payload.consents, ["marketing", "privacy"]);

    return (
      isGdprAccepted &&
      mandatoryFields &&
      !!isEmailValidated &&
      !!isNumberValidated &&
      (!isCompleteVersion || isMaterialChecked)
    );
  }, [isCompleteVersion, isEmailValidated, isNumberValidated, payload]);

  const updateMaterial = (state: FormPayload["materials"], id: FormMaterials, checked: boolean) => {
    let newState = state;
    if (checked) {
      newState = newState ? [...newState, id] : [id];
    } else {
      newState = newState?.filter((material) => material !== id);
    }
    return newState;
  };

  return (
    <ModalFormContainer {...props}>
      {requestStatus !== RequestStatus.INITIAL ? (
        <ModalOutcome {...{ requestStatus, successMessage, onClose }} />
      ) : (
        <>
          <Title color="light" style={{ marginBottom: "10px" }} variant="h3">
            {title}
          </Title>
          <RichText variant="light" raw={description} />
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
              type="email"
              error={payload.email && isEmailValidated === false}
              placeholder={`${labels["info-form-email"]}*`}
              onChange={(e) => setPayload({ ...payload, email: e.target.value })}
              shadow="dark"
            />
            <Input
              type="tel"
              error={payload.mobile && isNumberValidated === false}
              placeholder={`${labels["info-form-mobile"]}*`}
              onChange={(e) => setPayload({ ...payload, mobile: e.target.value })}
              shadow="dark"
            />

            <CountrySelect
              value={selectedNation}
              style={{ marginBottom: 25 }}
              onChange={(country) => {
                setSelectedNation(country);
                setPayload({ ...payload, country: country.iso3! });
              }}
            />
            <Input
              type="text"
              aria-label="city"
              style={{ marginBottom: 25 }}
              placeholder={`${labels["info-form-city"]}*`}
              onChange={(e) => setPayload({ ...payload, city: e.target.value })}
              shadow="dark"
            />
            <div>
              <Input
                type="text"
                placeholder={`${labels["info-form-company"]}*`}
                onChange={(e) => setPayload({ ...payload, company: e.target.value })}
                shadow="dark"
              />
            </div>
          </InputGrid>
          {isCompleteVersion && <Text color="light">{labels["info-form-materials-title"]}</Text>}
          {isCompleteVersion && (
            <MaterialsForm
              onCheckChange={(id, checked) =>
                setPayload({
                  ...payload,
                  materials: updateMaterial(payload.materials, id, checked),
                })
              }
            />
          )}
          <Divider />
          <GdprCheckbox
            onChange={(id, checked) =>
              setPayload({ ...payload, consents: { ...payload.consents, [id]: checked } })
            }
          />
          <FormButtons
            cancelButton={{
              label: labels["info-form-back"] || "",
              onClick: onClose,
            }}
            confirmButton={{
              label: labels["info-form-send-request-button"] || "",
              disabled: !isSendEnabled,
              onClick: handlePost,
            }}
          />
        </>
      )}
    </ModalFormContainer>
  );
};
