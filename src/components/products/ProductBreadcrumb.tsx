import { AnimatePresence, motion } from "framer-motion";
import React, { FC } from "react";

import { BreadcrumbItemData } from "../../hooks/breadcrumbs/types";
import { CatalogBreadcrumb } from "../catalog/CatalogBreadcrumb";

export interface ProductBreadcrumbProps {
  line?: Queries.Maybe<Queries.ContentfulLine>;
  breadcrumbItems: BreadcrumbItemData[];
}

export const ProductBreadcrumb: FC<ProductBreadcrumbProps> = ({ line, breadcrumbItems }) => {
  return (
    <AnimatePresence>
      {line && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <CatalogBreadcrumb items={breadcrumbItems} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
