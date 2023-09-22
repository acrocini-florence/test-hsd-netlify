import { Button, mqUntil, Title } from "@biesse-group/react-components";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React, { FC, isValidElement, ReactNode } from "react";
import styled, { css } from "styled-components";

const Root = styled.div`
  background-color: ${(props) => props.theme.color.lightGray};
  padding: 54px 90px 42px;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 40px;

  ${mqUntil(
    "md",
    css`
      padding: 52px 25px 40px;
    `
  )}

  ${mqUntil(
    "sm",
    css`
      padding: 0px 0px 35px 0px;
      height: auto;
    `
  )}
`;

const BannerContainer = styled.div`
  max-width: 1600px;
  height: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 120px;
  row-gap: 12px;
  grid-template-rows: auto auto auto 1fr auto;
  grid-template-areas:
    "back-button image-area"
    "tags image-area"
    "title image-area"
    "abstract image-area"
    "action image-area";

  ${mqUntil(
    "md",
    css`
      column-gap: 10px;
      grid-template-areas:
        "back-button ."
        "tags image-area"
        "title image-area"
        "abstract image-area"
        "action image-area";
    `
  )}

  ${mqUntil(
    "sm",
    css`
      column-gap: 0px;
      height: auto;
      grid-template-columns: 25px auto 25px;
      grid-template-rows: repeat(5, auto);
      grid-template-areas:
        ". back-button ."
        "image-area image-area image-area"
        ". tags ."
        ". title ."
        ". abstract ."
        ". action .";
    `
  )}
`;

const TagsWrapper = styled.div`
  grid-area: tags;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
  ${mqUntil(
    "sm",
    css`
      margin-bottom: 28px;
      margin-top: 8px;
    `
  )}
  > div {
    margin-right: 25px;
  }
`;

const TitleWrapper = styled.div`
  grid-area: title;
  max-width: 100%;
  margin-right: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledTitle = styled(Title)`
  font-size: 40px;

  ${mqUntil(
    "md",
    css`
      font-size: 30px;
    `
  )}

  ${mqUntil(
    "sm",
    css`
      margin-right: 0px;
    `
  )}
`;

const ImageContainer = styled.div`
  grid-area: image-area;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border-bottom-left-radius: ${(props) => props.theme.card.borderRadius};
`;

const StyledBackButton = styled(Button)`
  grid-area: back-button;
  margin-bottom: 20px;
  justify-self: start;

  ${mqUntil(
    "md",
    css`
      margin: 50px 0px 28px;
    `
  )}

  ${mqUntil(
    "md",
    css`
      margin: 12px 0px 0px -10px;
    `
  )}
`;

const ActionWrapper = styled.div`
  display: inline-flex;
  grid-area: action;
  margin-top: 3px;
`;

const AbstractWrapper = styled.div`
  display: inline-flex;
  grid-area: abstract;
`;

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  titleUppercase?: boolean;
  abstract?: JSX.Element;
  tags?: JSX.Element[];
  image?: IGatsbyImageData | ReactNode;
  action?: React.ReactNode;
  backLabel?: string | null;
  onBack?: () => void;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  titleUppercase,
  subtitle,
  abstract,
  image,
  tags,
  action,
  backLabel = "Back",
  onBack,
  ...props
}) => {
  return (
    <Root {...props}>
      <BannerContainer>
        {onBack && (
          <StyledBackButton leftIcon="chevron-left" variant="primary-naked" onClick={onBack}>
            {backLabel}
          </StyledBackButton>
        )}
        <ImageContainer>
          {isValidElement(image) ? (
            image
          ) : (
            <GatsbyImage
              loading="eager"
              style={{ height: "100%" }}
              image={image as IGatsbyImageData}
              alt={title}
            />
          )}
        </ImageContainer>
        {tags && <TagsWrapper>{tags}</TagsWrapper>}
        <TitleWrapper>
          <StyledTitle variant="h1" color="primary" uppercase={titleUppercase}>
            {title}
          </StyledTitle>
          {subtitle && (
            <Title
              variant="h2"
              size="sm"
              color="primary"
              style={{ marginBottom: "22px" }}
              uppercase={titleUppercase}
            >
              {subtitle}
            </Title>
          )}
        </TitleWrapper>
        {abstract && <AbstractWrapper>{abstract}</AbstractWrapper>}
        {action && <ActionWrapper>{action}</ActionWrapper>}
      </BannerContainer>
    </Root>
  );
};
