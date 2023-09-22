import { Input, Title } from "@biesse-group/react-components";
import { navigate } from "gatsby";
import React, { FC, FormEvent, useCallback, useState } from "react";
import styled from "styled-components";

import { useLabels } from "../../hooks/useLabels";
import { translatePath } from "../../i18n/localize-path";
import { QS_QUERY_KEY, QS_SOURCE_KEY } from "../../pages/search";
import { useLayoutContext } from "../Layout/layoutContext";
import { SearchIconButton } from "../search/SearchIIconButton";

export interface SearchModalProps {
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

export const SearchModal: FC<SearchModalProps> = ({ onClose, ...props }) => {
  const labels = useLabels(["search-title", "search-modal-form-placeholder"]);

  const { language } = useLayoutContext();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      const searchPath = translatePath({ path: "search", language });
      const queryParams = new URLSearchParams({
        [QS_QUERY_KEY]: searchQuery,
        [QS_SOURCE_KEY]: "menu",
      });

      navigate(`${searchPath}?${queryParams}`);
      onClose?.();
    },
    [language, onClose, searchQuery]
  );

  return (
    <Root {...props}>
      <InnerContainer>
        <StyledTitle color="light" variant="h2">
          {labels["search-title"]}
        </StyledTitle>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            border
            placeholder={labels["search-modal-form-placeholder"] ?? undefined}
            onChange={(e) => setSearchQuery(e.target.value)}
            shadow="dark"
            endDecoration={<SearchIconButton onClick={handleSubmit} />}
          />
        </form>
      </InnerContainer>
    </Root>
  );
};
