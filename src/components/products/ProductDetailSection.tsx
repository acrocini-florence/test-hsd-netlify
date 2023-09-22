import { mqUntil, Title, TitleProps } from "@biesse-group/react-components";
import React, { FC, PropsWithChildren } from "react";
import styled, { css } from "styled-components";

import { Section, SectionProps } from "../Section";

export interface ProductDetailSectionProps extends Pick<SectionProps, "$backgroundColor"> {
  title?: string | null;
  subtitle?: string | null;
  titleTag?: TitleProps["variant"];
  subtitleTag?: TitleProps["variant"];
}

const SectionInner = styled.div`
  width: 100%;
`;

const TitleContainer = styled.div`
  width: 25%;
  margin-top: 50px;
  float: left;

  ${mqUntil(
    "md",
    css`
      float: none;
      width: 100%;
      margin-top: 0;
      margin-bottom: 40px;
    `
  )}
`;

const MainContainer = styled.div`
  width: calc(75% - 50px);
  margin-left: 50px;
  float: right;

  ${mqUntil(
    "md",
    css`
      float: none;
      width: 100%;
      margin-left: 0;
    `
  )}
`;

export const ProductDetailSection: FC<PropsWithChildren<ProductDetailSectionProps>> = ({
  title,
  titleTag = "h2",
  subtitle,
  subtitleTag = "h3",
  $backgroundColor,
  children,
}) => (
  <Section $backgroundColor={$backgroundColor}>
    <SectionInner>
      <TitleContainer>
        {title && (
          <Title
            variant={titleTag}
            size="xxl"
            color="primary"
            uppercase
            style={{ marginBottom: 0 }}
          >
            {title}
          </Title>
        )}
        {subtitle && (
          <Title variant={subtitleTag} size="sm" color="primary" uppercase>
            {subtitle}
          </Title>
        )}
      </TitleContainer>
      <MainContainer>{children}</MainContainer>
    </SectionInner>
  </Section>
);
