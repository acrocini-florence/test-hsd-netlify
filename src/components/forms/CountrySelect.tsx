import { getKeys, Select } from "@biesse-group/react-components";
import { graphql, useStaticQuery } from "gatsby";
import React, { FC, useMemo } from "react";

import { useLabels } from "../../hooks/useLabels";
import { useLayoutContext } from "../Layout/layoutContext";

export interface CountrySelectProps {
  className?: string;
  style?: React.CSSProperties;
  value?: Queries.CountriesStatesCitiesJson;
  onChange?: (countryName: Queries.CountriesStatesCitiesJson) => void;
}

export const CountrySelect: FC<CountrySelectProps> = ({ value, onChange, ...props }) => {
  const { language } = useLayoutContext();
  const { allCountriesStatesCitiesJson } = useStaticQuery<Queries.Query>(graphql`
    query {
      allCountriesStatesCitiesJson {
        nodes {
          name
          id
          iso3
          translations {
            it
            de
            cn
            es
            kr
          }
          states {
            name
            id
            cities {
              id
              name
            }
          }
        }
      }
    }
  `);

  const labels = useLabels(["info-form-nation"]);

  const countriesMap = useMemo(() => {
    return allCountriesStatesCitiesJson.nodes.reduce<
      Record<string, Queries.CountriesStatesCitiesJson>
    >((acc, country) => {
      acc[country.id] = country;
      return acc;
    }, {});
  }, [allCountriesStatesCitiesJson.nodes]);

  return (
    <div {...props}>
      <Select
        value={value ? value.id : undefined}
        aria-label="nation"
        placeholder={`${labels["info-form-nation"]}*`}
        options={getKeys(countriesMap).map((countryId) => {
          const country = countriesMap[countryId];
          const translationKey = language as keyof Queries.CountriesStatesCitiesJsonTranslations;
          return {
            value: countryId,
            label: country.translations?.[translationKey] ?? country.name ?? "",
          };
        })}
        onChange={(countryId) => onChange?.(countriesMap[countryId])}
        shadow="dark"
      />
    </div>
  );
};
