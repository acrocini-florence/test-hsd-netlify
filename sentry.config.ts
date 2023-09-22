import * as Sentry from "@sentry/gatsby";

import packageJson from "./package.json";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sampleRate: 1.0,
  tracesSampleRate: 1.0, // Adjust this value in production
  release: packageJson.version,
  environment: process.env.GATSBY_DEPLOY_ENVIRONMENT,
  // TODO investigate on further configurations
  // beforeSend(event) {
  //   // Modify the event here
  //   if (event.user) {
  //     // Don't send user's email address
  //     delete event.user.email;
  //   }
  //   return event;
  // },
});

Sentry.configureScope((scope) => {
  scope.setTags({
    environment: process.env.GATSBY_DEPLOY_ENVIRONMENT,
  });
});
