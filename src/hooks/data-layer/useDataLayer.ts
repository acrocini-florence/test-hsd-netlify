import { useCallback } from "react";

import { formatText } from "./utils";

export interface DataLayerEvent {
  event: string;
  [key: string]: any;
}

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}

export function useDataLayer() {
  const pushEvent = useCallback(({ event, ...rest }: DataLayerEvent) => {
    if (typeof window !== "undefined" && process.env.GATSBY_GTAG_ID) {
      window.dataLayer = window.dataLayer ?? [];

      const eventToPush: DataLayerEvent = { event };
      for (let key of Object.keys(rest)) {
        const value = (rest as Record<string, any>)[key];
        if (value !== undefined && value !== null) {
          eventToPush[key] = formatText(value);
        } else {
          eventToPush[key] = ""; // convert null and undefined to empty string
        }
      }

      window.dataLayer.push(eventToPush);
    }
  }, []);

  return {
    dataLayer: typeof window !== "undefined" ? window.dataLayer : [],
    pushEvent,
  };
}
