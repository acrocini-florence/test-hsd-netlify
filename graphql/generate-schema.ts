const { SchemaGenerator } = require("./SchemaGenerator");
const path = require("path");

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV ?? "development"}`,
});

(async () => {
  const isVerbose = process.argv.includes("--verbose");

  const baseDir = "graphql";
  const generatedDir = path.join(baseDir, "generated");

  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN ?? "";

  const baseUrl = process.env.CONTENTFUL_HOST ?? "https://cdn.contentful.com";
  const queryParams = new URLSearchParams({
    access_token: accessToken,
    limit: "1000",
  });
  const url = `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/content_types?${queryParams}`;

  const generator = new SchemaGenerator({
    url,
    baseDir,
    generatedDir,
    isVerbose,
    saveOnFile: true,
    updateObjectTypes: true,
  });

  await generator.getSchema();
})();
