import { graphql } from "gatsby";
import React, { FC } from "react";

import config from "../../i18n/config";
import { LocalizedPathArgs, translatePath } from "../../i18n/localize-path";
import seoConfig from "./config.json";

export type SeoProps = {
  title: Nullable<string>;
  description: Nullable<string>;
  image: Nullable<string>;
  htmlLang: string;
  path: string;
  alternateParams: Record<string, LocalizedPathArgs["params"]> | undefined;
};

export const SEO: FC<SeoProps> = ({
  title,
  description,
  image,
  path,
  htmlLang,
  alternateParams,
}) => {
  const { title: defaultTitle, description: defaultDescription, siteUrl } = seoConfig;

  const alternateUrls = config.locales.map(({ localeCode: language }, i) => (
    <link
      key={i}
      rel="alternate"
      hrefLang={language}
      href={`${siteUrl}${translatePath({
        language,
        path,
        params: alternateParams?.[language],
      })}`}
    />
  ));

  const seo = {
    title: title ?? defaultTitle,
    description: description ?? defaultDescription,
    image: image ? `${image}` : undefined,
    url: `${siteUrl}${translatePath({
      language: htmlLang,
      path,
      params: alternateParams?.[htmlLang],
    })}`,
  };

  return (
    <>
      <html lang={htmlLang} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.image && <meta name="image" content={seo.image} />}
      <link rel="canonical" href={seo.url} />
      {alternateUrls}

      {/* Socials tags */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seo.url} />
      {seo.image && <meta property="og:image" content={seo.image} />}

      {/* Twitter tags */}
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {seo.image && <meta name="twitter:image" content={seo.image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
};

export const query = graphql`
  fragment Metadata on ContentfulPageMetadata {
    metaImage {
      url
    }
    metaTitle
    metaDescription
  }
`;
