import { useBreakpoints } from "@biesse-group/react-components";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { navigate } from "gatsby";
import React, { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { DataLayerEvent, useDataLayer } from "../../../hooks/data-layer";
import { translatePath } from "../../../i18n/localize-path";
import { useLayoutContext } from "../layoutContext";
import { CatalogMenuPanel } from "./CatalogMenuPanel";
import { LineMenuPanel } from "./LineMenuPanel";
import { MaterialMenuPanel } from "./MaterialMenuPanel";
import { SideMenuRootPanel } from "./SideMenuRootPanel";
import { TechnologyMenuPanel } from "./TechnologyMenuPanel";

const SHOW_ALL_LABEL = "show all";

export interface SelectionPathState {
  root?: "families" | "materials";
  materialSlug?: string;
  technologySlug?: string;
  materialName?: string;
  technologyName?: string;
}

export type VariantType = "desktop" | "mobile";

export interface SideMenuProps {
  className?: string;
  isOpen: boolean;
  fromFooter?: boolean;
  onOpenChange: (open: boolean) => void;
}

const MenuWrapper = styled(motion.div)`
  z-index: 10000;
  width: 100vw;
  height: 100vh;
  position: fixed;
`;

export const LayoutSideMenu: FC<SideMenuProps> = ({ isOpen, fromFooter, onOpenChange }) => {
  const [isRootOpen, setIsRootOpen] = useState(false);
  const [variant, setVariant] = useState<VariantType>("desktop");
  const [selectionPath, setSelectionPath] = useState<SelectionPathState>({});
  const { language } = useLayoutContext();
  const breakpoint = useBreakpoints();

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange,
  });

  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });

  const { getFloatingProps } = useInteractions([role, dismiss]);

  const headingId = useId();
  const descriptionId = useId();

  // Choose mobile or desktop version based on window width
  useEffect(() => {
    setVariant(!breakpoint.md ? "mobile" : "desktop");
  }, [breakpoint]);

  // Handle isRootOpen, needed for mobile version
  useEffect(() => {
    if (!isOpen) {
      setIsRootOpen(false);
    } else if (variant === "desktop" || fromFooter) {
      setIsRootOpen(true);
    }
  }, [fromFooter, isOpen, variant]);

  // OnClick declaration for Lines
  const handleLineAction = useCallback(
    (lineSlug: string | undefined) => {
      if (lineSlug) {
        const path = [
          selectionPath.materialSlug ? "materials" : "product-families",
          selectionPath.materialSlug && "{materialSlug}",
          selectionPath.technologySlug && "{technologySlug}",
          "{lineSlug}",
        ]
          .filter(Boolean)
          .join("/");

        navigate(
          translatePath({
            path,
            params: {
              materialSlug: selectionPath.materialSlug,
              technologySlug: selectionPath.technologySlug,
              lineSlug,
            },
            language: language,
          })
        );
      }
      onOpenChange(false);
    },
    [selectionPath, language, onOpenChange]
  );

  // Clear the selected Path whenever the menu is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectionPath({});
    }
  }, [isOpen]);

  const handleSelectTechnology = (technologySlug: string | undefined, technologyName: string) => {
    setSelectionPath({
      ...selectionPath,
      technologySlug,
      technologyName,
    });
  };

  const handleBackTechnology =
    variant === "desktop" || !!selectionPath.technologySlug
      ? undefined
      : () =>
          setSelectionPath({
            materialSlug: undefined,
            materialName: undefined,
            root: selectionPath.root === "materials" ? selectionPath.root : undefined,
          });

  const { pushEvent } = useDataLayer();

  return (
    <FloatingPortal>
      <AnimatePresence>
        {isOpen && (
          <MenuWrapper initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            (
            <FloatingOverlay lockScroll>
              <FloatingFocusManager context={context}>
                <div
                  ref={refs.setFloating}
                  aria-labelledby={headingId}
                  aria-describedby={descriptionId}
                  {...getFloatingProps()}
                  style={{ zIndex: 10000 }}
                >
                  <SideMenuRootPanel
                    productAction={() => setIsRootOpen(true)}
                    onClose={() => onOpenChange(false)}
                    isVisible={variant === "mobile" && isOpen}
                  />
                  <CatalogMenuPanel
                    variant={variant}
                    selectedLabel={selectionPath.root}
                    isVisible={isRootOpen}
                    onClose={!selectionPath.root ? () => onOpenChange(false) : undefined}
                    onClick={(selectedPath) => {
                      pushEvent({
                        event: "product_navigation",
                        navigation_level: "level_1",
                        level_1: selectedPath,
                      });
                      setSelectionPath({ root: selectedPath });
                    }}
                    onBack={
                      variant === "desktop" || selectionPath.root
                        ? undefined
                        : () => setIsRootOpen(false)
                    }
                  />
                  <MaterialMenuPanel
                    variant={variant}
                    selectedSlug={selectionPath.materialSlug}
                    isVisible={selectionPath.root === "materials"}
                    isCloseIconVisible={!selectionPath.materialSlug}
                    onShowAll={() => {
                      pushEvent({
                        event: "product_navigation",
                        navigation_level: "level_2",
                        level_1: selectionPath.root,
                        level_2: SHOW_ALL_LABEL,
                      });
                    }}
                    onClose={() => onOpenChange(false)}
                    onClick={(materialSlug, materialName) => {
                      pushEvent({
                        event: "product_navigation",
                        navigation_level: "level_2",
                        level_1: selectionPath.root,
                        level_2: materialName,
                      });
                      setSelectionPath({
                        ...selectionPath,
                        materialSlug: materialSlug,
                        materialName: materialName,
                        technologySlug: undefined,
                        technologyName: undefined,
                      });
                    }}
                    onBack={
                      variant === "desktop" || selectionPath.materialSlug
                        ? undefined
                        : () => setSelectionPath({})
                    }
                  />
                  {/* Technology Menu Default */}
                  <TechnologyMenuPanel
                    onShowAll={() => {
                      pushEvent({
                        event: "product_navigation",
                        navigation_level: "level_2",
                        level_1: selectionPath.root,
                        level_2: SHOW_ALL_LABEL,
                      });
                    }}
                    selectedSlug={selectionPath.technologySlug}
                    variant={variant}
                    isVisible={selectionPath.root === "families" && !selectionPath.materialSlug}
                    isCloseIconVisible={!selectionPath.technologySlug}
                    onClose={() => onOpenChange(false)}
                    onClick={(technologySlug, technologyName) => {
                      pushEvent({
                        event: "product_navigation",
                        navigation_level: "level_2",
                        level_1: selectionPath.root,
                        level_2: technologyName,
                      });
                      handleSelectTechnology(technologySlug, technologyName);
                    }}
                    onBack={handleBackTechnology}
                  />
                  {/* Technology Menu from Material */}
                  <TechnologyMenuPanel
                    onShowAll={() => {
                      pushEvent({
                        event: "product_navigation",
                        navigation_level: "level_3",
                        level_1: selectionPath.root,
                        level_2: selectionPath.materialName,
                        level_3: SHOW_ALL_LABEL,
                      });
                    }}
                    selectedSlug={selectionPath.technologySlug}
                    variant={variant}
                    isVisible={selectionPath.root === "materials" && !!selectionPath.materialSlug}
                    isCloseIconVisible={!selectionPath.technologySlug}
                    onClose={() => onOpenChange(false)}
                    onClick={(technologySlug, technologyName) => {
                      pushEvent({
                        event: "product_navigation",
                        navigation_level: "level_3",
                        level_1: selectionPath.root,
                        level_2: selectionPath.materialName,
                        level_3: technologyName,
                      });
                      handleSelectTechnology(technologySlug, technologyName);
                    }}
                    onBack={handleBackTechnology}
                    materialSlugFilter={selectionPath.materialSlug}
                  />
                  <LineMenuPanel
                    onShowAll={() => {
                      const event: DataLayerEvent = {
                        event: "product_navigation",
                        navigation_level: selectionPath?.materialSlug ? "level_4" : "level_3",
                        level_1: selectionPath.root,
                        level_2: selectionPath.technologyName,
                        level_3: selectionPath.materialName ?? SHOW_ALL_LABEL,
                      };
                      if (selectionPath.materialSlug) event.level_4 = SHOW_ALL_LABEL;
                      pushEvent(event);
                    }}
                    variant={variant}
                    isVisible={!!selectionPath.technologySlug}
                    onClose={() => onOpenChange(false)}
                    onClick={(lineSlug, lineName) => {
                      const event: DataLayerEvent = {
                        event: "product_navigation",
                        navigation_level: selectionPath?.materialSlug ? "level_4" : "level_3",
                        level_1: selectionPath.root,
                        level_2: selectionPath.technologyName,
                        level_3: selectionPath.materialName ?? lineName,
                      };
                      if (selectionPath.materialSlug) event.level_4 = lineName;
                      pushEvent(event);
                      handleLineAction(lineSlug);
                    }}
                    technologySlugFilter={selectionPath.technologySlug}
                    materialSlugFilter={selectionPath.materialSlug}
                    onBack={
                      variant === "desktop"
                        ? undefined
                        : () =>
                            setSelectionPath({
                              ...selectionPath,
                              technologySlug: undefined,
                              technologyName: undefined,
                            })
                    }
                  />
                </div>
              </FloatingFocusManager>
            </FloatingOverlay>
            )
          </MenuWrapper>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
};
