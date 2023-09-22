import { Icon, Logo, Modal, mqUntil, useModal } from "@biesse-group/react-components";
import { graphql, useStaticQuery } from "gatsby";
import React, { FC } from "react";
import styled, { css, useTheme } from "styled-components";

import { useLabels } from "../../../hooks/useLabels";
import { translatePath } from "../../../i18n/localize-path";
import { LanguageSelectionModal } from "../../LanguageSelectionModal";
import { RichText } from "../../RichText";
import { Section } from "../../Section";
import { useLayoutContext } from "../layoutContext";
import { NAV_ITEM_KEYS, NAV_PATHS, NavItem } from "../nav-items";
import { ChangeLanguageButton } from "./ChangeLanguageButton";
import { FooterLink } from "./FooterLink";
import { FooterSocialIcons } from "./FooterSocialIcons";

const FooterContainer = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.color.primary};
  color: ${(props) => props.theme.color.white};
  padding: 40px 0;
  margin-top: 40px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template:
    "logo . ."
    "company links extra" / 2fr 1fr 1fr;
  gap: 30px 80px;
  width: 100%;

  ${mqUntil(
    "md",
    css`
      grid-template-columns: 1fr 1fr 1fr;
      column-gap: 40px;
    `
  )}

  ${mqUntil(
    `sm`,
    css`
      display: flex;
      flex-direction: column;
      gap: 50px;
    `
  )}
`;

const CompanyContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: company;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  grid-area: links;
`;

const CompanyText = styled(RichText)`
  font-size: 13px;
  line-height: 18px;
  a {
    color: inherit;
    font-size: inherit;
  }
`;

const ExtraContainer = styled.div`
  grid-area: extra;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const LayoutFooter: FC = () => {
  const theme = useTheme();
  const { language } = useLayoutContext();

  const { allContentfulFooter } = useStaticQuery<Queries.Query>(graphql`
    query {
      allContentfulFooter {
        nodes {
          node_locale
          companySite {
            raw
          }
          changeLanguageLabel
          ...FooterSocialIcons
        }
      }
    }
  `);

  const labels = useLabels([
    "header-case-history",
    "header-company",
    "header-products",
    "header-news-and-events",
    "menu-materials",
    "menu-product-families",
  ]);

  const { isOpen, close, open } = useModal();

  const footer = allContentfulFooter.nodes.find(({ node_locale }) => node_locale === language);

  return footer ? (
    <FooterContainer>
      <Section verticalSpace={false}>
        <FooterGrid>
          <Logo name="HSD" color={theme.color.white} width="300px" style={{ gridArea: "logo" }} />
          <CompanyContainer>
            <Icon name="location" size="36px" style={{ marginBottom: 20 }} />
            <CompanyText raw={footer.companySite?.raw} />
          </CompanyContainer>
          <LinksContainer>
            {NAV_ITEM_KEYS.map((itemKey) => {
              return itemKey === NavItem.PRODUCTS ? (
                <React.Fragment key={itemKey}>
                  <FooterLink
                    label={labels["menu-product-families"] || ""}
                    to={translatePath({ path: "product-families", language })}
                  />
                  <FooterLink
                    label={labels["menu-materials"] || ""}
                    to={translatePath({ path: "materials", language })}
                  />
                </React.Fragment>
              ) : (
                <FooterLink
                  key={itemKey}
                  label={labels[`header-${itemKey}`] || ""}
                  to={translatePath({ path: NAV_PATHS[itemKey], language })}
                />
              );
            })}
          </LinksContainer>
          <ExtraContainer>
            <FooterSocialIcons footerData={footer} />
            <ChangeLanguageButton label={footer.changeLanguageLabel || ""} onClick={open} />
            <Modal isOpen={isOpen} close={close}>
              <LanguageSelectionModal onClose={close} />
            </Modal>
          </ExtraContainer>
        </FooterGrid>
      </Section>
    </FooterContainer>
  ) : null;
};
