import styled from "styled-components";

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.color.white};
  width: 100%;
  margin: 0px 0px 22px 0px;
`;
