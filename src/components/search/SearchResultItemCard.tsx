import { Text, Title } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { useLabels } from "../../hooks/useLabels";

export interface SearchResultItemCardProps {
  title: string;
  snippet: string;
  url: string;
}

const StyledTitle = styled(Title)`
  margin-bottom: 12px;
`;

const StyledLink = styled.a`
  display: block;
  margin: 12px 0 48px;
  font-weight: bold;
  :after {
    content: " >";
  }
  :hover {
    text-decoration: underline;
  }
  ${(props) =>
    css`
      color: ${props.theme.color.primary};
    `}
`;

export const SearchResultItemCard: FC<SearchResultItemCardProps> = ({ title, snippet, url }) => {
  const labels = useLabels(["search-result-item-link"]);
  return (
    <div>
      <StyledTitle variant="h3" size="sm" color="primary">
        <div dangerouslySetInnerHTML={{ __html: title }} />
      </StyledTitle>
      <Text>
        <div dangerouslySetInnerHTML={{ __html: snippet }} />
      </Text>
      <StyledLink href={url}>{labels["search-result-item-link"]}</StyledLink>
    </div>
  );
};
