import { useCallback } from "react";

import { FormPayload } from "../../components/forms/models/form-payload";
import { DataLayerEvent, useDataLayer } from "./useDataLayer";
import { getHashedString } from "./utils";

export function useTrackNewsletterSubscription() {
  const { pushEvent } = useDataLayer();
  return useCallback(
    ({ email }: FormPayload) => {
      const hashedUserEmail = getHashedString(email);
      const event: DataLayerEvent = {
        event: "newsletter_subscription",
        user_email_md5: hashedUserEmail.md5,
        user_email_sha256: hashedUserEmail.sha256,
      };
      pushEvent(event);
    },
    [pushEvent]
  );
}
