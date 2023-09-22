import { useMemo } from "react";

import { useLayoutContext } from "../../components/Layout/layoutContext";
import { translatePath } from "../../i18n/localize-path";
import { useLabels } from "../useLabels";
import { BreadcrumbItemData } from "./types";

export interface UseCatalogBreacrumbsProps {
  material?: Queries.ContentfulMaterial;
  technology?: Queries.ContentfulTechnology;
  line?: Queries.ContentfulLine;
  product?: Queries.ContentfulProduct;
}

const labelsIds = ["catalog-materials", "catalog-product-families"];

export function useCatalogBreadcrumbs({
  material,
  technology,
  line,
  product,
}: UseCatalogBreacrumbsProps) {
  const labels = useLabels(labelsIds);
  const originalLabels = useLabels(labelsIds, "en");
  const { language } = useLayoutContext();

  const breadcrumbItems: BreadcrumbItemData[] = useMemo(() => {
    const path = [material ? `materials` : `product-families`, material?.slug && "{slug}"]
      .filter(Boolean)
      .join("/");

    let basePath = translatePath({ path, language, params: { slug: material?.slug } });

    const items: BreadcrumbItemData[] = material
      ? [
          {
            label: labels["catalog-materials"] ?? "",
            originalLabel: originalLabels["catalog-materials"] ?? null,
            path: translatePath({ path: "materials", language }),
          },
          {
            label: material?.materialName ?? "",
            originalLabel: material?.originalEntry?.materialName ?? null,
            path: basePath,
          },
        ]
      : [
          {
            label: labels["catalog-product-families"] ?? "",
            originalLabel: originalLabels["catalog-product-families"] ?? null,
            path: translatePath({ path: "product-families", language }),
          },
        ];

    if (technology) {
      basePath = `${basePath}${technology.slug}`;
      items.push({
        label: technology.technologyName ?? "",
        originalLabel: technology.originalEntry?.technologyName ?? null,
        path: basePath,
      });
    }
    if (line) {
      basePath = `${basePath}${line.slug}`;
      items.push({
        label: line.lineName ?? "",
        originalLabel: line.originalEntry?.lineName ?? null,
        path: basePath,
      });
    }
    if (product) {
      items.push({
        label: product.productCode ?? "",
        originalLabel: product.originalEntry?.productCode ?? null,
        path: "",
      });
    }
    return items;
  }, [labels, line, material, originalLabels, product, technology, language]);

  return breadcrumbItems;
}
