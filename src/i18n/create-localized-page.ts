import { Actions, Page } from "gatsby";

import allLocales from "../data/LanguageCodesNames.json";
import config from "./config";
import { translatePath } from "./localize-path";

export const createLocalizedPage = <T>(
  { createPage, createRedirect }: Actions,
  page: Page<T>,
  localeCode: string | undefined
) => {
  const supportedLocales = config.locales.map(({ localeCode }) => localeCode);
  const unsupportedLocales = allLocales
    .map(({ code }) => code)
    .filter((code) => !supportedLocales.includes(code));

  const isNotFound = Boolean(page.path.match(/^\/404\/$/));
  const isOther404 = page.path.match("404.html") || page.path.match("dev-404-page");

  if (isNotFound || isOther404) {
    createPage({
      ...page,
      context: {
        ...page.context,
        language: config.defaultLocale,
        isDefault: true,
      },
    });
  }

  if (isOther404) {
    return;
  }

  if (isNotFound) {
    page.matchPath = "/*";
  }

  if (!localeCode) {
    config.locales.forEach(({ localeCode }) => {
      const localizedPath = translatePath({
        path: page.path,
        language: localeCode,
        params: { ...page.context },
      });

      createPage({
        ...page,
        path: localizedPath,
        matchPath: page.matchPath
          ? translatePath({
              path: page.matchPath,
              language: localeCode,
              params: { ...page.context },
            })
          : page.matchPath,
        context: {
          ...page.context,
          language: localeCode,
        },
      });

      if (!isNotFound) {
        createRedirect({
          fromPath: page.path,
          toPath: localizedPath,
          conditions: {
            language:
              localeCode === config.defaultLocale
                ? [localeCode, ...unsupportedLocales]
                : localeCode,
          },
        });
      }
    });
  } else {
    const localizedPath = translatePath({
      path: page.path,
      language: localeCode,
      params: { ...page.context },
    });

    createPage({
      ...page,
      path: localizedPath,
      matchPath: page.matchPath
        ? translatePath({ path: page.matchPath, language: localeCode, params: { ...page.context } })
        : page.matchPath,
      context: {
        ...page.context,
        language: localeCode,
      },
    });

    if (!isNotFound) {
      createRedirect({
        fromPath: page.path,
        toPath: localizedPath,
        conditions: {
          language:
            localeCode === config.defaultLocale ? [localeCode, ...unsupportedLocales] : localeCode,
        },
      });
    }
  }
};
