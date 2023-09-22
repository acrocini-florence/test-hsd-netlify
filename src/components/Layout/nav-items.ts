import { getKeys } from "@biesse-group/react-components";

import { LocalizePagesKey } from "../../i18n/localized-page-static-paths-map";

export enum NavItem {
  COMPANY = "company",
  PRODUCTS = "products",
  CASE_HISTORY = "case-history",
  NEWS_AND_EVENTS = "news-and-events",
  // SERVICES = "services",
  // RESEARCH_AND_DEV = "research-and-development",
}

//TODO code can be simplified
export const NAV_PATHS: Record<NavItem, LocalizePagesKey> = {
  [NavItem.COMPANY]: "company",
  [NavItem.PRODUCTS]: "products",
  // [HeaderItem.SERVICES] = "services",
  [NavItem.CASE_HISTORY]: "case-history",
  // [HeaderItem.RESEARCH_AND_DEV] = "research-and-development",
  [NavItem.NEWS_AND_EVENTS]: "news-and-events",
};

export const NAV_ITEM_KEYS = getKeys(NAV_PATHS);

export const CAREERS_PORTAL_URL =
  "https://career2.successfactors.eu/career?company=biessespa&site=VjItMC1hMS16SEpDL0lLZGRMOGxMWXExc0VuTFNBPT0=";
