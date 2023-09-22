import { BaseProps, Title } from "@biesse-group/react-components";
import React, { ReactNode } from "react";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  height: 100%;
  width: 100%;
`;

interface Props<T> extends BaseProps {
  title: string;
  items: T[];
  renderItem: (item: T, key: React.Key) => ReactNode;
}

export function CtaCardList<T>({ title, items, renderItem, ...props }: Props<T>) {
  return (
    <Root {...props}>
      <Title color="primary" variant="h2" size="xs" uppercase>
        {title}
      </Title>
      {items.map((item, index) => renderItem(item, index))}
    </Root>
  );
}
