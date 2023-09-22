import { Button } from "@biesse-group/react-components";
import { AnimatePresence, motion } from "framer-motion";
import { graphql, navigate, useStaticQuery } from "gatsby";
import React, { FC, useCallback } from "react";

import { useLabels } from "../../../hooks/useLabels";
import { translatePath } from "../../../i18n/localize-path";
import { useLayoutContext } from "../layoutContext";
import { VariantType } from "./LayoutSideMenu";
import { motionVariants, VariantsKeys } from "./motion-variants";
import { StyledMenuPanel } from "./StyledMenuPanel";

export interface MaterialMenuPanelProps {
  onClose: () => void;
  onBack?: () => void;
  isVisible?: boolean;
  selectedSlug?: string;
  variant: VariantType;
  isCloseIconVisible: boolean;
  onClick: (materialSlug: string | undefined, materialName: string) => void;
  className?: string;
  onShowAll: () => void;
}

export const MaterialMenuPanel: FC<MaterialMenuPanelProps> = ({
  selectedSlug,
  variant,
  onClose,
  onShowAll,
  onBack,
  onClick,
  isVisible,
  isCloseIconVisible,
  ...props
}) => {
  const { allContentfulMaterial } = useStaticQuery<Queries.Query>(graphql`
    query {
      allContentfulMaterial(sort: { materialName: ASC }) {
        nodes {
          ...MaterialData
          materialName
          originalEntry {
            materialName
          }
          node_locale
        }
      }
    }
  `);
  const labels = useLabels(["menu-materials", "menu-see-all"]);

  const { language } = useLayoutContext();

  const materialsList = allContentfulMaterial.nodes.filter((x) => x.node_locale === language);

  const handleSeeAllAction = useCallback(() => {
    navigate(translatePath({ path: "materials", language: language }));
    onClose();
    onShowAll();
  }, [language, onClose, onShowAll]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{ position: "fixed", left: 0, top: 0, zIndex: 3 }}
          custom={{
            mobileVariant: variant === "mobile" ? true : false,
            offset: "25vw",
            isSelected: !!selectedSlug,
          }}
          initial={VariantsKeys.CLOSED}
          exit={VariantsKeys.CLOSED}
          animate={VariantsKeys.OPEN}
          variants={motionVariants}
        >
          <StyledMenuPanel
            extra={
              <Button
                variant="primary"
                onClick={() => {
                  handleSeeAllAction();
                }}
              >
                {labels["menu-see-all"]}
              </Button>
            }
            onBack={onBack}
            activeItem={selectedSlug}
            onClose={isCloseIconVisible ? onClose : undefined}
            title={labels["menu-materials"] || "Materials"}
            variant="secondary"
            items={materialsList.map((material) => ({
              id: material.slug || "unselectable",
              label: material.materialName ?? "",
              onClick: () => {
                onClick &&
                  onClick(
                    material.slug || undefined,
                    material.originalEntry?.materialName ?? material.materialName ?? ""
                  );
              },
            }))}
            {...props}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
