import { borderRadius, mqUntil } from "@biesse-group/react-components";
import React, { forwardRef, PropsWithChildren } from "react";
import styled, { css } from "styled-components";

export const Root = styled.div<SectionProps>`
  ${(props) =>
    props.$backgroundColor &&
    css`
      background-color: ${props.theme.color[props.$backgroundColor]};
      ${borderRadius(props.theme.card.borderRadius)}
    `}

  ${(props) =>
    props.verticalSpace &&
    css`
      padding-top: 40px;
      padding-bottom: 40px;
    `}

  ${(props) =>
    props.horizontalSpace &&
    css`
      display: flex;
      justify-content: center;
      padding-left: 90px;
      padding-right: 90px;

      ${mqUntil(
        "md",
        css`
          padding-left: 25px;
          padding-right: 25px;
        `
      )}

      ${mqUntil(
        "sm",
        css`
          padding-left: 20px;
          padding-right: 20px;
        `
      )}
    `}
`;

export const ChildWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1600px;
`;

export interface SectionProps {
  horizontalSpace?: boolean;
  verticalSpace?: boolean;
  style?: React.CSSProperties;
  className?: string;
  $backgroundColor?: "lightGray";
}

export const Section = forwardRef<HTMLDivElement, PropsWithChildren<SectionProps>>(
  ({ horizontalSpace = true, verticalSpace = true, children, ...props }, ref) => {
    return (
      <Root {...{ horizontalSpace, verticalSpace }} ref={ref} {...props}>
        {horizontalSpace ? <ChildWrapper>{children}</ChildWrapper> : children}
      </Root>
    );
  }
);
