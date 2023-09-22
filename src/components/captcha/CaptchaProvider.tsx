import React, { FC, PropsWithChildren } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export const CaptchaProvider: FC<PropsWithChildren> = ({ children }) => {
  return process.env.GATSBY_REACT_APP_SITE_KEY ? (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.GATSBY_REACT_APP_SITE_KEY}>
      {children}
    </GoogleReCaptchaProvider>
  ) : (
    <>{children}</>
  );
};
