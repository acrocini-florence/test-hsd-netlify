import { Icon, IconProps, Text } from "@biesse-group/react-components";
import { graphql } from "gatsby";
import React, { FC } from "react";
import styled from "styled-components";

export interface FooterSocialIconsProps {
  footerData: Queries.FooterSocialIconsFragment;
}

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const FooterSocialIcons: FC<FooterSocialIconsProps> = ({ footerData }) => {
  const socialIcons: Array<{ icon: IconProps["name"]; url: string }> = [
    {
      url: footerData.linkedinIconUrl ?? "",
      icon: "linkedin",
    },
    {
      url: footerData.youtubeIconUrl ?? "",
      icon: "youtube",
    },
  ];

  return (
    <Root>
      <Text color="light">{footerData.socialIconsText}</Text>
      <IconsContainer>
        {socialIcons
          .filter(({ url }) => url)
          .map(({ icon, url }) => (
            <a href={url!} target="_blank" rel="noreferrer" key={url}>
              <Icon color="white" name={icon} size="30px" />
            </a>
          ))}
      </IconsContainer>
    </Root>
  );
};

export const query = graphql`
  fragment FooterSocialIcons on ContentfulFooter {
    socialIconsText
    youtubeIconUrl
    linkedinIconUrl
  }
`;
