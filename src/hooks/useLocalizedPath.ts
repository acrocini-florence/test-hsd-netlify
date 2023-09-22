import { useLayoutContext } from "../components/Layout/layoutContext";
import { LocalizedPathArgs, translatePath } from "../i18n/localize-path";

export function useLocalizedPath(path: string, params?: LocalizedPathArgs["params"]) {
  const { language } = useLayoutContext();
  return translatePath({ path, language, params });
}
