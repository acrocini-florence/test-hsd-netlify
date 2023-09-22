import { MenuPanelItem } from "@biesse-group/react-components";
import { AnimatePresence, motion } from "framer-motion";
import { navigate } from "gatsby";
import React, { FC } from "react";

import { useLabels } from "../../../hooks/useLabels";
import { translatePath } from "../../../i18n/localize-path";
import { useLayoutContext } from "../layoutContext";
import { CAREERS_PORTAL_URL, NAV_ITEM_KEYS, NAV_PATHS } from "../nav-items";
import { motionVariants, VariantsKeys } from "./motion-variants";
import { StyledMenuPanel } from "./StyledMenuPanel";

export interface SideMenuRootPanelProps {
  isVisible?: boolean;
  onClose?: () => void;
  productAction?: () => void;
}

export const SideMenuRootPanel: FC<SideMenuRootPanelProps> = ({
  isVisible,
  onClose,
  productAction,
}) => {
  const labels = useLabels([
    "header-case-history",
    "header-company",
    "header-research-and-development",
    "header-products",
    "header-services",
    "header-news-and-events",
    "header-country",
    "header-search",
    "header-careers",
    "header-contacts",
  ]);
  const { language } = useLayoutContext();

  const primaryItems: MenuPanelItem[] = NAV_ITEM_KEYS.map((e) => ({
    id: e,
    onClick: () => {
      navigate(translatePath({ path: NAV_PATHS[e], language }));
      onClose?.();
    },
    label: labels[`header-${e}`]!,
  }));
  const secondaryItems: MenuPanelItem[] = [
    {
      id: "careers",
      onClick: () => {
        window.open(CAREERS_PORTAL_URL, "_blank");
        onClose?.();
      },
      label: labels["header-careers"] || "",
    },
    {
      id: "contacts",
      onClick: () => {
        navigate(translatePath({ language, path: "contacts" }));
        onClose?.();
      },
      label: labels["header-contacts"] || "",
    },
  ];

  // Product voice of the Menu has a dedicated function
  primaryItems.forEach((element) => {
    if (element.id === "products") {
      element.onClick = productAction;
    }
  });
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{ position: "fixed", left: 0, top: 0, zIndex: 1 }}
          custom={{ mobileVariant: true, isSelected: true }}
          initial={VariantsKeys.CLOSED}
          exit={VariantsKeys.CLOSED}
          animate={VariantsKeys.OPEN}
          variants={motionVariants}
        >
          <StyledMenuPanel
            $isHeader={true}
            onClose={onClose}
            variant="dark"
            items={primaryItems.concat([{ id: "divider", divider: true }]).concat(secondaryItems)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
