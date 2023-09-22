import { Icon, IconProps } from "@biesse-group/react-components";
import React, { FC } from "react";
import styled from "styled-components";

const StyledIcon = styled(Icon)`
  cursor: pointer;
  margin-right: 20px;
`;

export interface SearchIconButtonProps extends Omit<IconProps, "name"> {}

export const SearchIconButton: FC<SearchIconButtonProps> = (props) => {
  return <StyledIcon color="primary" name="search" size="24px" {...props} />;
};
