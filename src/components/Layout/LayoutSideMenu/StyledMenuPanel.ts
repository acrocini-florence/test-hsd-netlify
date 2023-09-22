import { MenuPanel, mqUntil } from "@biesse-group/react-components";
import styled, { css } from "styled-components";

export const StyledMenuPanel = styled(MenuPanel)<{ $isHeader?: boolean }>`
  width: 25vw;
  ${({ $isHeader }) =>
    mqUntil(
      "md",
      css`
        width: calc(100vw ${() => (!$isHeader ? "- 30px" : "")});
      `
    )}
`;
