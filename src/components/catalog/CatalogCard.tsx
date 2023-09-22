import {
  borderRadius,
  Button,
  mqUntil,
  Text,
  Title,
  TitleProps,
} from "@biesse-group/react-components";
import { navigate } from "gatsby";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { actionHoverTransition } from "../../styles";
import { Link } from "../Link";

const StyledButton = styled(Button)``;

const Root = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-columns: 90px auto;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "image title" "abstract abstract" "action action";
  column-gap: 20px;
  row-gap: 12px;
  padding: 40px 20px 20px 30px;
  background-color: ${({ theme }) => theme.color.lightGray};
  ${({ theme }) => borderRadius(theme.card.borderRadius)}
  transition: all 0.5s ease-out;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.color.white};
    box-shadow: ${(props) => props.theme.card.boxShadow};

    ${StyledButton} {
      ${actionHoverTransition}
    }
  }
`;

const TitleWrapper = styled.div`
  grid-area: title;
  height: 100%;
  align-self: center;
  padding-right: 10px;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto;
  grid-template-areas: "pre-title" "title-main";
  overflow-wrap: anywhere;
`;

const StyledTitle = styled(Title)`
  grid-area: title-main;
  align-self: center;
  margin-bottom: 0px;
`;

const StyledPreTitle = styled(Text)`
  grid-area: pre-title;
  align-self: start;
  font-size: 24px;
  text-transform: uppercase;

  ${mqUntil(
    "sm",
    css`
      font-size: 20px;
    `
  )}
`;

const AbstractContainer = styled.div`
  grid-area: abstract;
  padding-right: 10px;
`;

const ActionArea = styled.div`
  grid-area: action;
  justify-self: end;
`;

const ImageWrapper = styled.div`
  grid-area: image;
  align-self: center;
  width: 100%;
  height: 100%;
  max-height: 90px;
`;

export interface CatalogCardProps {
  to: string;
  image?: React.ReactNode;
  preTitle?: string;
  title?: string;
  titleTag?: TitleProps["variant"];
  actionLabel?: string;
  abstract?: JSX.Element;
}

export const CatalogCard: FC<CatalogCardProps> = ({
  to,
  preTitle,
  image,
  title,
  titleTag = "h3",
  actionLabel,
  abstract,
  ...props
}) => {
  return (
    <Root onClick={() => navigate(to)} {...props}>
      <ImageWrapper>{image}</ImageWrapper>
      <TitleWrapper>
        {preTitle && (
          <StyledPreTitle color="primary" weight="bold">
            {preTitle}
          </StyledPreTitle>
        )}
        <StyledTitle uppercase color="primary" variant={titleTag} size="md">
          <Link to={to}>{title}</Link>
        </StyledTitle>
      </TitleWrapper>
      <AbstractContainer>{abstract}</AbstractContainer>
      <ActionArea>
        <StyledButton variant="primary-naked" size="small" rightIcon="chevron-right">
          {actionLabel}
        </StyledButton>
      </ActionArea>
    </Root>
  );
};
