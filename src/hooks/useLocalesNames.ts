import { graphql, useStaticQuery } from "gatsby";
import { useMemo } from "react";

import config from "../i18n/config";

export function useLocalesNames() {
  const { allLanguageCodesNamesJson } = useStaticQuery<Queries.Query>(graphql`
    query {
      allLanguageCodesNamesJson {
        nodes {
          code
          nativeName
        }
      }
    }
  `);

  const localesMap = useMemo(
    () =>
      config.locales.reduce<Record<string, string | null | undefined>>((acc, { localeCode }) => {
        const localeName = allLanguageCodesNamesJson.nodes.find(
          (localeData) => localeData.code === localeCode
        )?.nativeName;
        acc[localeCode] = localeName;
        return acc;
      }, {}),
    [allLanguageCodesNamesJson.nodes]
  );

  return localesMap;
}
