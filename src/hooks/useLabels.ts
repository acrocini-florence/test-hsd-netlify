import { useMemo } from "react";

import { useLayoutContext } from "../components/Layout/layoutContext";
import { useLabelsContext } from "../contexts/labels";

export function useLabels<T = any>(
  labels?: (keyof T)[],
  language?: string
): Record<keyof T, string | null> {
  const { language: currentLanguage } = useLayoutContext();
  const labelsContext = useLabelsContext();
  if (!labelsContext) throw new Error("useLabels must be invoked under LabelsProvider");

  const { allContentfulLabel, allContentfulLabelRichText } = labelsContext;

  return useMemo(() => {
    const lang = language ?? currentLanguage;

    const filterNodes = (node: Queries.ContentfulLabel | Queries.ContentfulLabelRichText) =>
      node.node_locale === lang &&
      node.contentfulid &&
      (!labels || labels.includes(node.contentfulid as keyof T));

    const allStringLabels = allContentfulLabel.nodes
      .filter(filterNodes)
      .reduce<{ [key: string]: string | null }>((acc, node) => {
        acc[node.contentfulid!] = node.value;
        return acc;
      }, {});

    const allRichTextLabels = allContentfulLabelRichText.nodes
      .filter(filterNodes)
      .reduce<{ [key: string]: string | null }>((acc, node) => {
        acc[node.contentfulid!] = node.value?.raw || null;
        return acc;
      }, {});

    return {
      ...allStringLabels,
      ...allRichTextLabels,
    } as Record<keyof T, string | null>;
  }, [allContentfulLabel, allContentfulLabelRichText, currentLanguage, labels, language]);
}
