import type { GatsbyConfig } from "gatsby";
import { createProxyMiddleware } from "http-proxy-middleware";

import { httpConfig } from "./src/config/http-config";
import i18nConfig from "./src/i18n/config";

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const siteUrl = process.env.SITEMAP_URL;

let localizedNodes: any = {};

const config: GatsbyConfig = {
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: {
    typesOutputPath: "gatsby-types.d.ts",
  },
  plugins: [
    // `gatsby-plugin-netlify`,
    `gatsby-plugin-recaptcha`,
    `gatsby-plugin-gatsby-cloud`,
    {
      resolve: "gatsby-source-contentful",
      options: {
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        host: process.env.CONTENTFUL_HOST || "cdn.contentful.com",
        environment: process.env.CONTENTFUL_ENVIRONMENT_ID || "master",
      },
    },
    {
      resolve: "gatsby-plugin-sharp",
      options: {
        defaults: {
          placeholder: "none",
        },
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-image",
    "gatsby-plugin-styled-components",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    "gatsby-transformer-json",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "data",
        path: "./src/data/",
      },
    },
    "@sentry/gatsby",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "HSD Mechatronics",
        short_name: "HSD",
        start_url: "/",
        theme_color: "#003594",
        background_color: "white",
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: "standalone",
        icon: "src/images/icon.png", // This path is relative to the root of the site.
        // An optional attribute which provides support for CORS check.
        // If you do not provide a crossOrigin option, it will skip CORS for manifest.
        // Any invalid keyword or empty string defaults to `anonymous`
        crossOrigin: `use-credentials`,
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `
          {
            allSitePage {
              nodes {
                path
                pageContext
                component
              }
            }
          }
        `,
        resolveSiteUrl: () => siteUrl,
        resolvePages: ({ allSitePage: { nodes } }: any) => {
          localizedNodes = nodes.reduce((acc: any, node: any) => {
            acc[node.component] = {
              ...(acc[node.component] || {}),
              [node.pageContext.language]: node,
            };
            return acc;
          }, {});

          return nodes.filter((node: any) => !node.path.match(/\/404/));
        },
        serialize: (node: any) => {
          return {
            url: node.path,
            links: i18nConfig.locales.map(({ localeCode }) => ({
              url: siteUrl + localizedNodes[node.component][localeCode].path,
              lang: localeCode,
            })),
          };
        },
      },
    },
    ...(process.env.GATSBY_GTAG_ID
      ? [
          {
            resolve: "gatsby-plugin-google-tagmanager",
            options: {
              id: process.env.GATSBY_GTAG_ID,
              includeInDevelopment: !!process.env.GTAG_ENABLED,
            },
          },
        ]
      : []),
    ...(process.env.GATSBY_COOKIEBOT_ID
      ? [
          {
            resolve: "gatsby-plugin-cookiebot",
            options: {
              cookiebotId: process.env.GATSBY_COOKIEBOT_ID,
              manualMode: true,
              includeInDevelopment: true,
              pluginDebug: process.env.NODE_ENV === "development",
            },
          },
        ]
      : []),
  ],
  developMiddleware: (app) => {
    app.use(
      httpConfig.apiPrefix,
      createProxyMiddleware({
        target: httpConfig.url,
        secure: false,
      })
    );
  },
};

export default config;
