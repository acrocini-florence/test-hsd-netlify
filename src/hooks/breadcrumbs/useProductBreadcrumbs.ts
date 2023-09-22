import { useEffect, useMemo, useState } from "react";

import { useCatalogBreadcrumbs } from "./useCatalogBreadcrumbs";

export interface useProductBreacrumbsProps {
  queryParams: string;
  product?: Queries.ContentfulProduct;
}

export function useProductBreadcrumbs({ queryParams, product }: useProductBreacrumbsProps) {
  const [materialSlug, setMaterialSlug] = useState<string | null>(null);
  const [lineSlug, setLineSlug] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(queryParams);
    setMaterialSlug(params.get("material"));
    setLineSlug(params.get("line"));
    setIsMounted(true);
  }, [queryParams]);

  const line = lineSlug ? product?.lines?.find((l) => l?.slug === lineSlug) : undefined;

  const material = materialSlug
    ? product?.materials?.find((m) => m?.slug === materialSlug)
    : undefined;

  const breadcrumbItems = useCatalogBreadcrumbs({
    material: material as Queries.ContentfulMaterial,
    technology: line?.technology as Queries.ContentfulTechnology,
    line: line as Queries.ContentfulLine,
    product: product as Queries.ContentfulProduct,
  });

  return useMemo(
    () => ({
      line,
      material,
      breadcrumbItems: isMounted ? breadcrumbItems : [],
    }),
    [breadcrumbItems, isMounted, line, material]
  );
}
