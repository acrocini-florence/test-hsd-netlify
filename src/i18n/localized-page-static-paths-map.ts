export type LocalizePathElement = {
  en: string;
  it: string;
  de: string;
};

export const localizedPageStaticPathsMap = {
  "case-history": {
    en: "case-history",
    it: "case-history",
    de: "case-history",
  },
  company: {
    en: "company",
    it: "azienda",
    de: "unternehmen",
  },
  contacts: {
    en: "contacts",
    it: "contatti",
    de: "kontakt",
  },
  materials: {
    it: "materiali",
    en: "materials",
    de: "materialien",
  },
  "product-families": {
    it: "famiglie-prodotti",
    en: "product-families",
    de: "produkt-familien",
  },
  "news-and-events": {
    it: "news-ed-eventi",
    en: "news-and-events",
    de: "nachrichten-und-events",
  },
  products: {
    it: "prodotti",
    en: "products",
    de: "produkte",
  },
  search: {
    it: "cerca",
    en: "search",
    de: "suche",
  },
  news: {
    it: "news",
    en: "news",
    de: "nachrichten",
  },
  events: {
    it: "eventi",
    en: "events",
    de: "veranstaltungen",
  },
};

export type LocalizePagesKey = keyof typeof localizedPageStaticPathsMap;
