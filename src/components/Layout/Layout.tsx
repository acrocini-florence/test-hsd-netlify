import { GlobalStyle, mqUntil } from "@biesse-group/react-components";
import "@biesse-group/react-components/dist/font-faces.css";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/en";
import "dayjs/locale/it";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";
import styled, { css, ThemeProvider } from "styled-components";

import { translatePath } from "../../i18n/localize-path";
import { WebsiteStyle } from "../../styles";
import { hsdTheme } from "../../themes/hsd-theme";
import { defaultLayoutContextValue, LayoutContext } from "./layoutContext";
import { LayoutFooter } from "./LayoutFooter";
import { LayoutHeader } from "./LayoutHeader";
import { LayoutSideMenu } from "./LayoutSideMenu";

dayjs.extend(localizedFormat);

export interface LayoutProps {
  currentPath: string;
  language: string;
}

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const LayoutMain = styled.main<{ overlayMenu?: boolean }>`
  overflow-y: initial;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  z-index: 0;

  ${(props) =>
    props.overlayMenu &&
    css`
      margin-top: -140px;

      ${mqUntil(
        "md",
        css`
          margin-top: -75px;
        `
      )}
      ${mqUntil(
        "sm",
        css`
          margin-top: -70px;
        `
      )}
    `}
`;

const LayoutContent = styled.div`
  flex: 1 1 auto;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
`;

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({ children, currentPath, language }) => {
  const isHomepage = useMemo(
    () => !!currentPath.match(new RegExp(`^${translatePath({ path: "/", language })}/?$`)),
    [currentPath, language]
  );

  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuOpenFromFooter, setMenuOpenFromFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled((window.scrollY || 0) > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenCatalog = (options: { fromFooter: boolean } = { fromFooter: false }) => {
    setMenuOpenFromFooter(options.fromFooter);
    setIsMenuOpen(true);
  };

  return (
    <ThemeProvider theme={hsdTheme}>
      <GlobalStyle />
      <WebsiteStyle />
      <LayoutContext.Provider value={{ ...defaultLayoutContextValue, language, currentPath }}>
        <LayoutWrapper>
          <HeaderWrapper>
            <LayoutHeader
              headerLogo={isHomepage}
              scrolled={!isHomepage || scrolled}
              onOpenCatalog={handleOpenCatalog}
            />
          </HeaderWrapper>
          <LayoutSideMenu
            isOpen={isMenuOpen}
            fromFooter={menuOpenFromFooter}
            onOpenChange={setIsMenuOpen}
          />
          <LayoutMain overlayMenu={isHomepage}>
            <LayoutContent>{children}</LayoutContent>
            <LayoutFooter />
          </LayoutMain>
        </LayoutWrapper>
      </LayoutContext.Provider>
    </ThemeProvider>
  );
};
