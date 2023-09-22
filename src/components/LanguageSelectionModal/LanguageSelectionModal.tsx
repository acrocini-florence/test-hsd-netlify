import { Title } from "@biesse-group/react-components";
import { navigate } from "gatsby";
import React, { FC } from "react";
import styled from "styled-components";

import { useLabels } from "../../hooks/useLabels";
import { useLocalesNames } from "../../hooks/useLocalesNames";
import config from "../../i18n/config";
import { translatePath } from "../../i18n/localize-path";
import { useLayoutContext } from "../Layout/layoutContext";
import { LanguageButton } from "./LanguageButton";

export interface LanguageSelectionModalProps {
  className?: string;
  onClose?: () => void;
}

const Root = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 180px 0px 60px 0px;
  padding: 0px 25px;
`;

const InnerContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  max-width: 660px;
  gap: 30px;
`;

const StyledTitle = styled(Title)`
  font-size: 40px;
  margin-bottom: 20px;
`;

export const LanguageSelectionModal: FC<LanguageSelectionModalProps> = ({ onClose, ...props }) => {
  const labels = useLabels(["language-select-title"]);

  const localesNames = useLocalesNames();
  const { language } = useLayoutContext();

  return (
    <Root {...props}>
      <InnerContainer>
        <StyledTitle color="light" variant="h2">
          {labels["language-select-title"]}
        </StyledTitle>
        {config.locales.map(({ localeCode }, index) => {
          return (
            <LanguageButton
              key={index}
              onClick={() => {
                navigate(translatePath({ path: "/", language: localeCode }));
                onClose?.();
              }}
              selected={language === localeCode}
            >
              {localeCode.toUpperCase()}{" "}
              {localesNames[localeCode] ? `(${localesNames[localeCode]})` : ""}
            </LanguageButton>
          );
        })}
      </InnerContainer>
    </Root>
  );
};
