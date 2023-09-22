import { Icon, Text } from "@biesse-group/react-components";
import React, { FC, PropsWithChildren } from "react";
import styled from "styled-components";

export interface LanguageButtonProps {
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

const Root = styled.div`
  display: inline-flex;
  gap: 12px;
  cursor: pointer;
`;

const StyledText = styled(Text)`
  font-size: 22px;
`;

const Check = styled(Icon)<{ $isSelected?: boolean }>`
  opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0.3)};
`;

export const LanguageButton: FC<PropsWithChildren<LanguageButtonProps>> = ({
  selected,
  onClick,
  children,
  ...props
}) => {
  return (
    <Root onClick={onClick} {...props}>
      <Check color="white" size="30px" name="check-mark" $isSelected={selected} />
      <StyledText color="light" weight="regular">
        {children}
      </StyledText>
    </Root>
  );
};
