import { GatsbyBrowser } from "gatsby";
import React from "react";

import { CaptchaProvider } from "./src/components/captcha/CaptchaProvider";
import { Layout } from "./src/components/Layout";
import { LabelsProvider } from "./src/contexts/labels";

export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = ({ element, props }) => {
  return props?.pageResources?.page?.path?.match("dev-404-page") ? (
    element
  ) : (
    <CaptchaProvider>
      <LabelsProvider>
        <Layout
          currentPath={props.location.pathname}
          language={props.pageContext["language"] as string}
        >
          {element}
        </Layout>
      </LabelsProvider>
    </CaptchaProvider>
  );
};
