export interface SearchResultItem {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  cacheId: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  pagemap: {
    cse_thumbnail: Array<{
      src: string;
      width: string;
      height: string;
    }>;
    metatags: Array<{
      "og:image": string;
      "og:type": string;
      "twitter:card": string;
      "twitter:title": string;
      "og:site_name": string;
      "twitter:url": string;
      "og:title": string;
      "og:description": string;
      "twitter:image": string;
      "twitter:site": string;
      viewport: string;
      "twitter:description": string;
      "og:url": string;
    }>;
    cse_image: Array<{
      src: string;
    }>;
  };
}

export interface SearchResult {
  queries: {
    request: Array<{
      searchTerms: string;
    }>;
  };
  items: SearchResultItem[];
}
