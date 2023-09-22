import { createGlobalStyle } from "styled-components";

export const WebsiteStyle = createGlobalStyle`
  /* body, html {
    overflow-x: hidden;
  } */

  /* body {
    height: 100vh;
    overflow-y: auto;

    &.modal-open{
      overflow-y: hidden;
    }
  } */

  .grecaptcha-badge { 
    visibility: hidden;
  }
`;

export * from "./transitions";
