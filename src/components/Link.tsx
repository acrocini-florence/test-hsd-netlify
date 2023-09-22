import { Link as GatsbyLink, GatsbyLinkProps } from "gatsby";
import styled from "styled-components";

export interface LinkProps<T> extends Omit<GatsbyLinkProps<T>, "ref"> {}

export const UnstyledLink = styled(GatsbyLink)`
  color: inherit;
`;

export const Link = styled(UnstyledLink)`
  display: inline-flex;
`;
