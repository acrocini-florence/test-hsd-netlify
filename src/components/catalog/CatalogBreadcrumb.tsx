import { Breadcrumb } from "@biesse-group/react-components";
import React, { FC } from "react";

import { BreadcrumbItemData } from "../../hooks/breadcrumbs/types";
import { Link } from "../Link";

export interface CatalogBreadcrumbProps {
  items: BreadcrumbItemData[];
}

export const CatalogBreadcrumb: FC<CatalogBreadcrumbProps> = ({ items }) => {
  return (
    // TODO non-localized link
    <Breadcrumb items={items} renderLink={(path, children) => <Link to={path}>{children}</Link>} />
  );
};
