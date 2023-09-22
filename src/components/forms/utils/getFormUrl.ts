import { httpConfig } from "../../../config/http-config";

export function getFormUrl() {
  if (process.env.NODE_ENV === "development") {
    return httpConfig.postApi;
  }

  return httpConfig.url + httpConfig.postApi;
}
