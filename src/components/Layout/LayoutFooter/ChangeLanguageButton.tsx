import { Icon, Text } from "@biesse-group/react-components";
import React from "react";
import styled from "styled-components";

import { useLayoutContext } from "../layoutContext";

const StyledButton = styled.button`
  outline: 0;
  border: none;
  background-color: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  color: ${(props) => props.theme.color.white};
`;

export interface ChangeLanguageButtonProps {
  label: string;
  onClick?: () => void;
}

export const ChangeLanguageButton = React.forwardRef<HTMLButtonElement, ChangeLanguageButtonProps>(
  ({ label, onClick }, ref) => {
    const { language } = useLayoutContext();

    return (
      <StyledButton onClick={onClick} ref={ref}>
        <Text weight="book">
          {label} (<Text weight="bold">{language.toUpperCase()}</Text>)
        </Text>
        <Icon name="country" size="30px" style={{ marginLeft: 20 }} />
      </StyledButton>
    );
  }
);
