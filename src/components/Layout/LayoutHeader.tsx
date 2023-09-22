import { Header, HeaderProps, Logo, Modal, useModal } from "@biesse-group/react-components";
import React, { FC, ReactNode } from "react";
import styled, { useTheme } from "styled-components";

import { useDataLayer } from "../../hooks/data-layer";
import { useLabels } from "../../hooks/useLabels";
import { useLocalesNames } from "../../hooks/useLocalesNames";
import { translatePath } from "../../i18n/localize-path";
import { LocalizePagesKey } from "../../i18n/localized-page-static-paths-map";
import { LanguageSelectionModal } from "../LanguageSelectionModal";
import { Link } from "../Link";
import { SearchModal } from "../SearchModal";
import { useLayoutContext } from "./layoutContext";
import { CAREERS_PORTAL_URL, NAV_ITEM_KEYS, NAV_PATHS } from "./nav-items";

const StyledLink = styled(Link)`
  > span {
    font-size: ${(props) => props.theme.font.regular.body.md} !important;
  }
`;

const StyledCta = styled.div`
  cursor: pointer;
  > span {
    font-size: ${(props) => props.theme.font.regular.body.md} !important;
  }
`;

export interface LayoutHeaderProps {
  headerLogo?: boolean;
  scrolled?: boolean;
  onOpenCatalog?: () => void;
}

export const LayoutHeader: FC<LayoutHeaderProps> = ({ headerLogo, scrolled, onOpenCatalog }) => {
  const theme = useTheme();

  const labels = useLabels([
    "header-case-history",
    "header-company",
    "header-research-and-development",
    "header-products",
    "header-services",
    "header-news-and-events",
    "header-search",
    "header-careers",
    "header-contacts",
    "homepage-title",
  ]);

  const localesNames = useLocalesNames();
  const { language } = useLayoutContext();

  const getLinkRenderer = (path: LocalizePagesKey) => (children: ReactNode) =>
    <StyledLink to={translatePath({ path, language })}>{children}</StyledLink>;

  const {
    isOpen: isLanguageModalOpen,
    close: closeLanguageModal,
    open: openLanguageModal,
  } = useModal();

  const renderLanguageModal = (children: ReactNode) => (
    <>
      <div style={{ cursor: "pointer" }} onClick={openLanguageModal}>
        {children}
      </div>
      <Modal isOpen={isLanguageModalOpen} close={closeLanguageModal}>
        <LanguageSelectionModal onClose={closeLanguageModal} />
      </Modal>
    </>
  );

  const { isOpen: isSearchModalOpen, close: closeSearchModal, open: openSearchModal } = useModal();

  const renderSearchModal = (children: ReactNode) => (
    <>
      <div style={{ cursor: "pointer" }} onClick={openSearchModal}>
        {children}
      </div>
      <Modal isOpen={isSearchModalOpen} close={closeSearchModal}>
        <SearchModal onClose={closeSearchModal} />
      </Modal>
    </>
  );

  const { pushEvent } = useDataLayer();

  const logo = (
    <Link to={translatePath({ path: "/", language })}>
      <Logo name="HSD" color={theme.color.white} title={labels["homepage-title"] ?? ""} />
    </Link>
  );

  const searchIcon: HeaderProps["navIcons"] =
    process.env.GATSBY_GOOGLE_SEARCH_ENGINE_ID && process.env.GATSBY_GOOGLE_SEARCH_API_KEY
      ? [
          {
            icon: "search",
            label: labels["header-search"] || "",
            renderLink: renderSearchModal,
          },
        ]
      : [];

  const navIcons: HeaderProps["navIcons"] = [
    {
      icon: "careers",
      label: labels["header-careers"] || "",
      renderLink: (children) => (
        <a
          href={CAREERS_PORTAL_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            pushEvent({
              event: "header_careers",
            })
          }
        >
          {children}
        </a>
      ),
    },
    {
      icon: "contacts",
      label: labels["header-contacts"] || "",
      renderLink: (children) => (
        <StyledLink
          to={translatePath({ path: "contacts", language })}
          onClick={() =>
            pushEvent({
              event: "header_contact",
            })
          }
        >
          {children}
        </StyledLink>
      ),
    },
    ...searchIcon,
    {
      icon: "country",
      label: localesNames[language] || language,
      onMobileHeader: true,
      renderLink: renderLanguageModal,
    },
  ];

  return (
    <Header
      onOpen={onOpenCatalog}
      logo={headerLogo ? <h1>{logo}</h1> : logo}
      variant={scrolled ? "colored" : "transparent"}
      navIcons={navIcons}
      navLinks={NAV_ITEM_KEYS.map((e) => ({
        label: labels[`header-${e}`]!,
        renderLink:
          e !== "products"
            ? getLinkRenderer(NAV_PATHS[e])
            : (children) => <StyledCta onClick={onOpenCatalog}>{children}</StyledCta>,
      }))}
    />
  );
};
