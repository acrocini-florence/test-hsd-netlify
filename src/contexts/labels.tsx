import { graphql, useStaticQuery } from "gatsby";
import React, { createContext, FC, PropsWithChildren, useContext } from "react";

export const LabelsContext = createContext<Queries.Query | null>(null);

export const LabelsProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useStaticQuery<Queries.Query>(graphql`
    query {
      allContentfulLabel {
        nodes {
          value
          contentfulid
          node_locale
        }
      }
      allContentfulLabelRichText {
        nodes {
          contentfulid
          node_locale
          value {
            raw
          }
        }
      }
    }
  `);

  return <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>;
};

export function useLabelsContext() {
  return useContext(LabelsContext);
}
