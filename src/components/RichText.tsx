import { BaseProps, Text, TextProps } from "@biesse-group/react-components";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import React, { FC } from "react";
import styled from "styled-components";

interface RichTextProps extends BaseProps {
  raw?: string | null;
  variant?: "dark" | "light";
  size?: TextProps["size"];
  responsive?: TextProps["responsive"];
}

const Root = styled.div`
  white-space: break-spaces;
  a {
    color: ${({ theme }) => theme.color.primary};
    text-decoration: underline;
    font-weight: bold;
  }
`;

export const RichText: FC<RichTextProps> = ({ size, raw, variant = "dark", ...props }) => {
  return (
    <Root>
      {raw &&
        documentToReactComponents(JSON.parse(raw), {
          renderText: (text) => {
            return text
              .split("\n")
              .reduce<(string | JSX.Element | false)[]>((acc, textSegment, index) => {
                return [...acc, index > 0 && <br key={index} />, textSegment];
              }, []);
          },
          renderNode: {
            [BLOCKS.PARAGRAPH]: (_, children) => (
              <Text
                size={size}
                tag="p"
                color={variant === "light" ? "light" : "default"}
                {...props}
              >
                {children}
              </Text>
            ),
          },
        })}
    </Root>
  );
};
