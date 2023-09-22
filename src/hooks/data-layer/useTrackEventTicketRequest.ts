import { useCallback } from "react";

import { FormPayload } from "../../components/forms/models/form-payload";
import { DataLayerEvent, useDataLayer } from "./useDataLayer";
import { getHashedString } from "./utils";

export function useTrackEventTicketRequest() {
  const { pushEvent } = useDataLayer();
  return useCallback(
    ({ email }: FormPayload, event: Pick<Queries.ContentfulEvent, "eventName">) => {
      const hashedUserEmail = getHashedString(email);
      const eventToPush: DataLayerEvent = {
        event: "exposition_partecipation",
        nome_fiera: event.eventName,
        user_email_md5: hashedUserEmail.md5,
        user_email_sha256: hashedUserEmail.sha256,
      };
      pushEvent(eventToPush);
    },
    [pushEvent]
  );
}
