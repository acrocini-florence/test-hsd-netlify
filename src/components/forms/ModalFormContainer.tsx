import React, { FC, PropsWithChildren } from "react";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  overflow-y: auto;
  margin: 180px 0px 60px 0px;
  padding: 0px 25px;
`;

const Inner = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  max-width: 660px;
`;

export interface ModalFormContainerProps
  extends PropsWithChildren<{ className?: string; style?: React.CSSProperties }> {}

export const ModalFormContainer: FC<ModalFormContainerProps> = ({ children, ...props }) => {
  return (
    <Root {...props}>
      <Inner>{children}</Inner>
    </Root>
  );
};
