import { Button, ButtonProps, Text } from "@biesse-group/react-components";
import React, { PropsWithChildren, useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export interface CaptchaButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick?: (token: string) => void;
}

export const CaptchaButton = React.forwardRef<
  HTMLButtonElement,
  PropsWithChildren<CaptchaButtonProps>
>((props, ref) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Create an event handler so you can call the verification on button click event
  const handleReCaptchaVerify = useCallback(async () => {
    try {
      if (!executeRecaptcha) {
        console.log("Execute recaptcha not yet available");
        return;
      }

      const token = await executeRecaptcha("submit");
      props.onClick?.(token);
    } catch (e) {
      console.log("Something went wrong during captcha check", e);
    }
  }, [executeRecaptcha, props]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Button
        ref={ref}
        {...props}
        // Overwrite OnClick
        onClick={handleReCaptchaVerify}
        disabled={
          // Disable until captcha is responding
          !executeRecaptcha ||
          // Disable if no Site Key was provided
          !process.env.GATSBY_REACT_APP_SITE_KEY ||
          // Disable for original reasons
          props.disabled
        }
      />
      <Text size="xs" color="light">
        This site is protected by reCAPTCHA and the Google{" "}
        <u>
          <a href="https://policies.google.com/privacy">Privacy Policy</a>
        </u>{" "}
        and{" "}
        <u>
          <a href="https://policies.google.com/terms">Terms of Service</a>
        </u>{" "}
        apply.
      </Text>
    </div>
  );
});
