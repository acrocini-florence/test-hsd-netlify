import {
  localizedPageStaticPathsMap,
  LocalizePagesKey,
  LocalizePathElement,
} from "./localized-page-static-paths-map";

export type LocalizedUrlParams = Record<string, string | undefined | null>;

export interface LocalizedPathArgs {
  path: string;
  language: string;
  params?: LocalizedUrlParams;
  translationMap?: typeof localizedPageStaticPathsMap;
}

export function translatePath({ path, language, params, translationMap }: LocalizedPathArgs) {
  const translations = translationMap ?? localizedPageStaticPathsMap;
  const pieces = path.split("/");

  const translatedUrl = pieces
    .filter(Boolean)
    .map((piece) => {
      const paramMatch = piece.match(/^\{([a-zA-Z0-9]*)\}/);
      if (paramMatch === null) {
        return (
          translations[piece as LocalizePagesKey]?.[language as keyof LocalizePathElement] ?? piece
        );
      } else {
        return params?.[paramMatch[1]];
      }
    })
    .filter(Boolean)
    .join("/");

  return `/${language}/${translatedUrl + (translatedUrl.length ? "/" : "")}`;
}
