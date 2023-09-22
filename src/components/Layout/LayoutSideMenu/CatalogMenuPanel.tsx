import { Button } from "@biesse-group/react-components";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC } from "react";
import styled from "styled-components";

import { useLabels } from "../../../hooks/useLabels";
import { SelectionPathState, VariantType } from "./LayoutSideMenu";
import { motionVariants, VariantsKeys } from "./motion-variants";
import { StyledMenuPanel } from "./StyledMenuPanel";

export interface CatalogMenuPanelProps {
  isVisible?: boolean;
  variant: VariantType;
  selectedLabel: SelectionPathState["root"];
  onClose?: () => void;
  onBack?: () => void;
  onClick: (selectedLabel: SelectionPathState["root"]) => void;
  className?: string;
}

const PlaceholderMargin = styled(Button)`
  opacity: 0;
  pointer-events: none;
`;

export const CatalogMenuPanel: FC<CatalogMenuPanelProps> = ({
  selectedLabel,
  variant,
  isVisible,
  onClose,
  onClick,
  onBack,
}) => {
  const labels = useLabels(["menu-materials", "menu-product-families", "menu-macrocategories"]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: variant === "mobile" ? 2 : 4,
          }}
          custom={{
            mobileVariant: variant === "mobile" ? true : false,
            isSelected: !!selectedLabel,
          }}
          initial={VariantsKeys.CLOSED}
          exit={VariantsKeys.CLOSED}
          animate={VariantsKeys.OPEN}
          variants={motionVariants}
        >
          <StyledMenuPanel
            extra={<PlaceholderMargin variant="primary" />}
            $isHeader={false}
            onBack={onBack}
            activeItem={selectedLabel}
            onClose={onClose}
            title={labels["menu-macrocategories"] || "Macrocategories"}
            variant="primary"
            items={[
              {
                id: "families",
                label: labels["menu-product-families"] || "Product Families",
                onClick: () => {
                  onClick("families");
                },
              },
              {
                id: "materials",
                label: labels["menu-materials"] || "Materials",
                onClick: () => {
                  onClick("materials");
                },
              },
            ]}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
