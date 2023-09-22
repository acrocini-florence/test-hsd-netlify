import SentryWebpackPlugin from "@sentry/webpack-plugin";
import { GatsbyNode } from "gatsby";
import path from "path";

import { SchemaGenerator } from "./graphql/SchemaGenerator";
import {
  NEWS_FILTERS,
  NEWS_PAGE_LIMIT,
} from "./src/components/news-and-events/news-and-events-constants";
import config from "./src/i18n/config";
import { createLocalizedPage } from "./src/i18n/create-localized-page";

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
  stage,
  loaders,
}) => {
  if (process.env.NODE_ENV === "production" && !process.env.EXCLUDE_SENTRY) {
    actions.setWebpackConfig({
      plugins: [
        new SentryWebpackPlugin({
          org: "biesse-group",
          project: "hsd-website",
          ignore: ["app-*", "polyfill-*", "framework-*", "webpack-runtime-*"],
          // Specify the directory containing build artifacts
          include: "public",
          // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
          // and needs the `project:releases` and `org:read` scopes
          authToken: process.env.SENTRY_AUTH_TOKEN,
          // Optionally uncomment the line below to override automatic release name detection
          // release: process.env.RELEASE,
        }),
      ],
    });
  }

  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /bad-module/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  if (stage === "develop-html") {
    actions.setWebpackConfig({
      devServer: {
        historyApiFallback: true,
        allowedHosts: "all",
        compress: true,
        disableHostCheck: true,
      },
    });
  }
};

export const onCreatePage: GatsbyNode["onCreatePage"] = ({ actions, page }) => {
  const { deletePage } = actions;

  if (!page?.context?.language) {
    deletePage(page);
    createLocalizedPage(actions, page, undefined);
  }
};

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions }) => {
  const projectDetailTemplate = path.resolve("./src/templates/project-detail.tsx");
  const newsAndEventsTemplate = path.resolve("./src/templates/news-and-events.tsx");
  const newsDetailTemplate = path.resolve("./src/templates/news-detail.tsx");
  const eventDetailTemplate = path.resolve("./src/templates/event-detail.tsx");
  const productDetailTemplate = path.resolve("./src/templates/product-detail.tsx");
  const materialDetailTemplate = path.resolve("./src/templates/material-detail.tsx");
  const productFamilyDetail = path.resolve("./src/templates/product-family-detail.tsx");
  const productLineDetail = path.resolve("./src/templates/product-line-detail.tsx");

  const result = await graphql<Queries.PagesQuery>(
    `
      query Pages($defaultLanguage: String) {
        allContentfulProject {
          nodes {
            slug
            node_locale
            contentful_id
          }
        }
        allDefaultLangNews: allContentfulNews(filter: { node_locale: { eq: $defaultLanguage } }) {
          nodes {
            slug
            tag
          }
        }
        allContentfulNews {
          nodes {
            slug
            tag
            node_locale
            contentful_id
          }
        }
        allContentfulEvent {
          nodes {
            slug
            node_locale
            contentful_id
          }
        }
        allContentfulMaterial {
          nodes {
            slug
            node_locale
            contentful_id
          }
        }
        allContentfulTechnology {
          nodes {
            slug
            node_locale
            contentful_id
            line {
              slug
              contentful_id
            }
          }
        }
        allContentfulProduct {
          nodes {
            slug
            node_locale
            contentful_id
          }
        }
      }
    `,
    { defaultLanguage: config.defaultLocale }
  );

  if (result.errors) {
    throw result.errors;
  }

  result.data?.allContentfulProject.nodes.forEach(({ slug, contentful_id, node_locale }) => {
    createLocalizedPage(
      actions,
      {
        path: `case-history/{slug}`,
        component: projectDetailTemplate,
        context: { slug, contentful_id },
      },
      node_locale
    );
  });

  //Create pages for all news and events
  const newsLength = result.data?.allDefaultLangNews.nodes.length || 0;
  const numPages = Math.ceil(newsLength / NEWS_PAGE_LIMIT);
  Array.from({ length: numPages || 1 }).forEach((_, i) => {
    createLocalizedPage(
      actions,
      {
        path: "news-and-events/{page}",
        component: newsAndEventsTemplate,
        context: {
          skip: i * NEWS_PAGE_LIMIT,
          limit: NEWS_PAGE_LIMIT,
          filter: NEWS_FILTERS,
          currentPage: i + 1,
          page: i === 0 ? `` : `${i + 1}`,
          totalPages: numPages,
        },
      },
      undefined
    );
  });

  //Create pages for filtered news and events
  NEWS_FILTERS.forEach((tag) => {
    const filteredLength =
      result.data?.allDefaultLangNews.nodes.filter((x) => x.tag === tag).length || 0;
    const numPages = Math.ceil(filteredLength / NEWS_PAGE_LIMIT);
    Array.from({ length: numPages || 1 }).forEach((_, i) => {
      createLocalizedPage(
        actions,
        {
          path: "news-and-events/{tag}/{page}",
          component: newsAndEventsTemplate,
          context: {
            skip: i * NEWS_PAGE_LIMIT,
            limit: NEWS_PAGE_LIMIT,
            filter: [tag],
            tag,
            currentPage: i + 1,
            page: i === 0 ? `` : `${i + 1}`,
            totalPages: numPages,
          },
        },
        undefined
      );
    });
  });

  result.data?.allContentfulNews.nodes.forEach(({ slug, contentful_id, node_locale }) => {
    createLocalizedPage(
      actions,
      {
        path: `news/{slug}`,
        component: newsDetailTemplate,
        context: { slug, contentful_id },
      },
      node_locale
    );
  });

  result.data?.allContentfulEvent.nodes.forEach(({ slug, contentful_id, node_locale }) => {
    createLocalizedPage(
      actions,
      {
        path: `events/{slug}`,
        component: eventDetailTemplate,
        context: { slug, contentful_id },
      },
      node_locale
    );
  });

  result.data?.allContentfulProduct.nodes.forEach(({ slug, contentful_id, node_locale }) => {
    createLocalizedPage(
      actions,
      {
        path: `products/{slug}`,
        component: productDetailTemplate,
        context: { slug, contentful_id },
      },
      node_locale
    );
  });

  result.data?.allContentfulTechnology.nodes.forEach((technology) => {
    const { slug, contentful_id, node_locale } = technology;
    createLocalizedPage(
      actions,
      {
        path: `product-families/{slug}`,
        component: productFamilyDetail,
        context: { slug, contentful_id },
      },
      node_locale
    );

    technology.line?.forEach((tech_line) => {
      const { slug, contentful_id } = tech_line ?? {};
      createLocalizedPage(
        actions,
        {
          path: `product-families/{technologySlug}/{slug}/`,
          component: productLineDetail,
          context: {
            slug,
            technologySlug: technology?.slug,
            contentful_id,
            technologyContentful_id: technology.contentful_id,
          },
        },
        node_locale
      );
    });
  });

  result.data?.allContentfulMaterial.nodes.forEach((material) => {
    const { slug, contentful_id, node_locale } = material;
    createLocalizedPage(
      actions,
      {
        path: `materials/{slug}`,
        component: materialDetailTemplate,
        context: { slug, contentful_id },
      },
      node_locale
    );

    result.data?.allContentfulTechnology.nodes.forEach((technology) => {
      const { slug, contentful_id } = technology;
      createLocalizedPage(
        actions,
        {
          path: `materials/{material}/{slug}`,
          component: productFamilyDetail,
          context: {
            slug,
            material: material.slug,
            contentful_id,
            MaterialContentful_id: material.contentful_id,
          },
        },
        node_locale
      );

      technology.line?.forEach((tech_line) => {
        const { slug, contentful_id } = tech_line ?? {};

        createLocalizedPage(
          actions,
          {
            path: `materials/{material}/{technology}/{slug}`,
            component: productLineDetail,
            context: {
              slug,
              material: material.slug,
              technology: technology.slug,
              contentful_id,
              technologyContentful_id: technology.contentful_id,
              materialContentful_id: material.contentful_id,
            },
          },
          material.node_locale
        );
      });
    });
  });
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = async ({
  actions,
}) => {
  const { createTypes } = actions;

  const baseDir = "graphql";
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID ?? "master";
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN ?? "";

  const baseUrl = `https://${process.env.CONTENTFUL_HOST ?? "cdn.contentful.com"}`;
  const queryParams = new URLSearchParams({
    access_token: accessToken,
    limit: "1000",
  });
  const url = `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/content_types?${queryParams}`;

  const generator = new SchemaGenerator({
    url,
    baseDir,
    isVerbose: false,
  });

  const schema = await generator.getSchema();
  createTypes(schema);
};

function getOriginalEntryResolver(type: string) {
  return {
    type,
    resolve: (source: any, args: any, context: any, info: any) => {
      return context.nodeModel.findOne({
        type,
        query: {
          filter: {
            contentful_id: { eq: source.contentful_id },
            node_locale: { eq: "en" },
          },
        },
      });
    },
  };
}

export const createResolvers: GatsbyNode["createResolvers"] = ({ createResolvers }) => {
  const resolvers = {
    ContentfulProduct: {
      originalEntry: getOriginalEntryResolver("ContentfulProduct"),
    },
    ContentfulNews: {
      originalEntry: getOriginalEntryResolver("ContentfulNews"),
    },
    ContentfulProject: {
      originalEntry: getOriginalEntryResolver("ContentfulProject"),
    },
    ContentfulHeroCarouselSlide: {
      originalEntry: getOriginalEntryResolver("ContentfulHeroCarouselSlide"),
    },
    ContentfulNewsStrip: {
      originalEntry: getOriginalEntryResolver("ContentfulNewsStrip"),
    },
    ContentfulTechnology: {
      originalEntry: getOriginalEntryResolver("ContentfulTechnology"),
    },
    ContentfulMaterial: {
      originalEntry: getOriginalEntryResolver("ContentfulMaterial"),
    },
    ContentfulLine: {
      originalEntry: getOriginalEntryResolver("ContentfulLine"),
    },
  };

  createResolvers(resolvers);
};
