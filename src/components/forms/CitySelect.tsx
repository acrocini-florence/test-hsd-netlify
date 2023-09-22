import { Select } from "@biesse-group/react-components";
import React, { FC, useMemo } from "react";

import { useLabels } from "../../hooks/useLabels";

export interface CitySelectProps {
  className?: string;
  style?: React.CSSProperties;
  selectedNation?: Queries.CountriesStatesCitiesJson;
  onChange?: (cityName?: Queries.CountriesStatesCitiesJsonStatesCities) => void;
  value?: Queries.CountriesStatesCitiesJsonStatesCities;
}

export const CitySelect: FC<CitySelectProps> = ({ value, selectedNation, onChange, ...props }) => {
  const labels = useLabels(["info-form-city", "info-form-select-nation-first"]);

  const cities = useMemo(() => {
    const states = selectedNation?.states || [];
    return states.reduce<Queries.Maybe<Queries.CountriesStatesCitiesJsonStatesCities>[]>(
      (acc, state) =>
        acc
          .concat(state?.cities || [])
          .sort((a, b) => (a?.name || "").localeCompare(b?.name || "")),
      []
    );
  }, [selectedNation?.states]);

  const handleChange = (selectedCity: string) => {
    const city = cities.find((e) => e?.id?.toString() === selectedCity) ?? undefined;
    onChange?.(city);
  };

  return (
    <div {...props}>
      <Select
        value={value?.id?.toString()}
        disabled={!selectedNation}
        aria-label="city"
        placeholder={`${labels["info-form-city"]}*`}
        options={
          selectedNation
            ? cities.map((city) => ({
                value: city?.id?.toString() ?? "",
                label: city?.name ?? "",
              }))
            : [{ label: labels["info-form-select-nation-first"] ?? "", value: "" }]
        }
        onChange={handleChange}
        shadow="dark"
      />
    </div>
  );
};
