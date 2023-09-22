import { GatsbySSR } from "gatsby";
import React from "react";

export { wrapPageElement } from "./gatsby-shared";

export const onRenderBody: GatsbySSR["onRenderBody"] = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="cookie-declaration"
      id="CookieDeclaration"
      src={`https://consent.cookiebot.com/${process.env.GATSBY_COOKIEBOT_ID}/cd.js`}
      type="text/javascript"
      async
    />,
  ]);
};
