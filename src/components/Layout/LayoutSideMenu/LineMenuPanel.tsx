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

export interface LineMenuPanelProps {
  isVisible?: boolean;
  variant: VariantType;
  onShowAll: () => void;
  onClose?: () => void;
  onBack?: () => void;
  onClick: (lineSlug: string | undefined, lineName: string) => void;
  materialSlugFilter?: string;
  technologySlugFilter?: string;
  className?: string;
}

export const LineMenuPanel: FC<LineMenuPanelProps> = ({
  variant,
  isVisible,
  onClose,
  onBack,
  onClick,
  onShowAll,
  materialSlugFilter,
  technologySlugFilter,
  ...props
}) => {
  const { allContentfulLine } = useStaticQuery<Queries.Query>(graphql`
    query {
      allContentfulLine(sort: { lineName: ASC }) {
        nodes {
          node_locale
          slug
          lineName
          originalEntry {
            lineName
          }
          technology {
            slug
          }
          materials {
            ...MaterialData
          }
        }
      }
    }
  `);
  const labels = useLabels(["menu-product-lines", "menu-see-all"]);

  const { language } = useLayoutContext();

  const linesListUnfiltered = allContentfulLine.nodes
    .filter((x) => x.node_locale === language)
    .filter((line) => line.technology?.slug === technologySlugFilter);

  const linesListFiltered = linesListUnfiltered.filter((line) =>
    line?.materials?.find((material) => material?.slug === materialSlugFilter)
  );

  const linesList = materialSlugFilter ? linesListFiltered : linesListUnfiltered;

  const handleSeeAllAction = useCallback(() => {
    if (technologySlugFilter) {
      const path = [
        materialSlugFilter ? `materials` : `product-families`,
        materialSlugFilter && "{materialSlugFilter}",
        technologySlugFilter && "{technologySlugFilter}",
      ]
        .filter(Boolean)
        .join("/");

      navigate(
        translatePath({
          path,
          language: language,
          params: {
            technologySlugFilter,
            materialSlugFilter,
          },
        })
      );
      onClose?.();
      onShowAll();
    }
  }, [language, materialSlugFilter, onClose, onShowAll, technologySlugFilter]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{ position: "fixed", left: 0, top: 0, zIndex: variant === "mobile" ? 5 : 1 }}
          custom={{
            mobileVariant: variant === "mobile" ? true : false,
            offset: materialSlugFilter ? "75vw" : "50vw",
            isSelected: false,
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
            onClose={onClose}
            title={labels["menu-product-lines"] || "Product lines"}
            variant="white"
            items={linesList.map((line) => ({
              id: line.slug || "unselectable",
              label: line.lineName ?? "",
              onClick: () => {
                onClick &&
                  onClick(
                    line.slug || undefined,
                    line.originalEntry?.lineName ?? line.lineName ?? ""
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
