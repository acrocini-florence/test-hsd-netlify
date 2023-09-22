import { Icon } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { Link } from "../../Link";

export interface FooterLinkProps {
  to?: string;
  onClick?: () => void;
  label: string;
}

const footerLinkStyle = css`
  color: ${(props) => props.theme.color.white};
  font-size: ${(props) => props.theme.font.regular.body.md};
  text-transform: uppercase;
  line-height: 20px;
  white-space: nowrap;
  font-weight: ${(props) => props.theme.font.weight.book};
  cursor: pointer;
`;

const StyledButton = styled.button`
  outline: 0;
  border: none;
  background-color: transparent;
  padding: 0;
  text-align: left;
  ${footerLinkStyle};
`;

const StyledLink = styled(Link)`
  ${footerLinkStyle}
`;

export const FooterLink: FC<FooterLinkProps> = ({ to, onClick, label }) => {
  const children = (
    <>
      <Icon name="chevron-right" size="18px" style={{ marginRight: 12 }} />
      <span>{label}</span>
    </>
  );
  return to ? (
    <StyledLink to={to}>{children}</StyledLink>
  ) : (
    <StyledButton onClick={onClick}>{children}</StyledButton>
  );
};
