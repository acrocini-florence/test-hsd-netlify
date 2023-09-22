import { mqUntil } from "@biesse-group/react-components";
import styled, { css } from "styled-components";

export const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 35px;
  row-gap: 15px;
  margin-top: 34px;
  margin-bottom: 10px;

  ${mqUntil(
    `sm`,
    css`
      grid-template-columns: 1fr;
    `
  )}
`;
