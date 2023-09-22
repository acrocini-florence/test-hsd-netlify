import { useCallback } from "react";

import { useLayoutContext } from "../../components/Layout/layoutContext";
import { BreadcrumbItemData } from "../breadcrumbs/types";
import { DataLayerEvent, useDataLayer } from "./useDataLayer";

export enum PageType {
  Category = "category",
  ProductFamilies = "product families",
  Materials = "materials",
  Form = "form",
  Product = "product",
  Home = "home",
  Contacts = "contacts",
  Company = "company",
  CaseHistory = "case history",
  Project = "project",
  NewsAndEvents = "news and events",
  Events = "events",
  News = "news",
  Search = "search",
}

export enum SiteArea {
  Company = "company",
  Contacts = "contacts",
  Products = "products",
  CaseHistory = "case history",
  NewsAndEvents = "news and events",
  Home = "home",
  Search = "search",
}

export interface PageviewEventProps {
  page_language?: string;
  page_type: PageType | string | null;
  site_area: SiteArea | null;
  breadcrumbs: BreadcrumbItemData[] | null;
  material: Queries.ContentfulMaterial | null;
  technology: Queries.ContentfulTechnology | null;
  line: Queries.ContentfulLine | null;
}

export function useTrackPageview() {
  const { pushEvent } = useDataLayer();
  const { language } = useLayoutContext();

  const trackPageview = useCallback(
    ({ breadcrumbs, material, line, technology, ...rest }: PageviewEventProps) => {
      const event: DataLayerEvent = {
        event: "dl_start",
        page_language: language,
        line: line?.originalEntry?.lineName ?? line?.lineName ?? null,
        product_family:
          technology?.originalEntry?.technologyName ?? technology?.technologyName ?? null,
        material: material?.originalEntry?.materialName ?? material?.materialName ?? null,
        breadcrumbs:
          breadcrumbs
            ?.map((breadcrumb) => {
              const { originalLabel, label } = breadcrumb;
              if (!originalLabel) {
                console.warn("GTag > breadcrumbs > missing originalLabel", breadcrumb);
              }
              return originalLabel ?? label;
            })
            .join(" | ") ?? null,
        ...rest,
      };
      pushEvent(event);
    },
    [pushEvent, language]
  );

  return trackPageview;
}
