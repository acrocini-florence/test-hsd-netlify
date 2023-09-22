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

export interface TechnologyMenuPanelProps {
  isVisible?: boolean;
  selectedSlug?: string;
  variant: VariantType;
  isCloseIconVisible: boolean;
  onClose: () => void;
  onBack?: () => void;
  onClick: (technologySlug: string | undefined, technologyName: string) => void;
  materialSlugFilter?: string;
  className?: string;
  onShowAll: () => void;
}

export const TechnologyMenuPanel: FC<TechnologyMenuPanelProps> = ({
  onClose,
  onClick,
  onBack,
  isVisible,
  variant,
  selectedSlug,
  isCloseIconVisible,
  materialSlugFilter,
  onShowAll,
  ...props
}) => {
  const { allContentfulTechnology } = useStaticQuery<Queries.Query>(graphql`
    query {
      allContentfulTechnology(sort: { technologyName: ASC }) {
        nodes {
          node_locale
          slug
          technologyName
          originalEntry {
            technologyName
          }
          line {
            materials {
              ...MaterialData
            }
          }
        }
      }
    }
  `);
  const labels = useLabels(["menu-product-families", "menu-see-all"]);

  const { language } = useLayoutContext();

  const technologiesListUnfiltered = allContentfulTechnology.nodes.filter(
    (x) => x.node_locale === language
  );

  const technologiesListFiltered = technologiesListUnfiltered.filter((technology) =>
    technology.line?.find((line) =>
      line?.materials?.find((material) => material?.slug === materialSlugFilter)
    )
  );

  const technologiesList = materialSlugFilter
    ? technologiesListFiltered
    : technologiesListUnfiltered;

  const handleSeeAllAction = useCallback(() => {
    const path = [
      materialSlugFilter ? `materials` : "product-families",
      materialSlugFilter && "{materialSlugFilter}",
    ]
      .filter(Boolean)
      .join("/");
    navigate(translatePath({ path, language, params: { materialSlugFilter } }));
    onClose();
    onShowAll();
  }, [language, materialSlugFilter, onClose, onShowAll]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{ position: "fixed", left: 0, top: 0, zIndex: variant === "mobile" ? 4 : 2 }}
          custom={{
            mobileVariant: variant === "mobile" ? true : false,
            offset: materialSlugFilter ? "50vw" : "25vw",
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
            title={labels["menu-product-families"] || "Product Families"}
            variant="light"
            items={technologiesList.map((technology) => ({
              id: technology.slug || "unselectable",
              label: technology.technologyName ?? "",
              onClick: () => {
                onClick &&
                  onClick(
                    technology.slug || undefined,
                    technology.originalEntry?.technologyName ?? technology.technologyName ?? ""
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
