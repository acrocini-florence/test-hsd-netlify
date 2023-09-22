import { Button, useRefWithCallback } from "@biesse-group/react-components";
import { graphql, HeadProps, PageProps } from "gatsby";
import React, { FC, useCallback, useEffect } from "react";

import { BranchesGrid } from "../components/contacts/BranchesGrid";
import { RequestInfoForm } from "../components/forms/RequestInfoForm";
import { PageHeader } from "../components/PageHeader";
import { RichText } from "../components/RichText";
import { Section } from "../components/Section";
import { SEO } from "../components/Seo/Seo";
import { PageType, SiteArea, useTrackPageview } from "../hooks/data-layer";
import { useLabels } from "../hooks/useLabels";

const ContactsPage: React.FC<PageProps<Queries.ContactsPageQuery>> = ({
  data: { contentfulHeroBanner: header },
}) => {
  const labels = useLabels(["contacts-ask-info-button", "contacts-page-title"]);

  const [infoFormRef, setInfoFormRef] = useRefWithCallback<HTMLDivElement>();

  const handleOnAskInfo = useCallback(() => {
    if (infoFormRef.current) {
      infoFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [infoFormRef]);

  const trackPageview = useTrackPageview();
  useEffect(() => {
    trackPageview({
      page_type: PageType.Contacts,
      site_area: SiteArea.Contacts,
      breadcrumbs: null,
      material: null,
      technology: null,
      line: null,
    });
  }, [trackPageview]);

  return (
    <div>
      {header && (
        <PageHeader
          image={header.image?.gatsbyImageData}
          title={header.title ?? ""}
          subtitle={header.subtitle ?? undefined}
          titleUppercase
          abstract={<RichText raw={header.description?.raw} />}
          action={
            <Button variant="primary" onClick={handleOnAskInfo}>
              {labels["contacts-ask-info-button"]}
            </Button>
          }
        />
      )}
      <Section>
        <BranchesGrid />
      </Section>
      <RequestInfoForm
        pageType={PageType.Contacts}
        productCode={null}
        ref={setInfoFormRef}
        style={{ marginBottom: 30 }}
      />
    </div>
  );
};

export default ContactsPage;

export const Head: FC<HeadProps<Queries.ContactsPageQuery, { language: string }>> = ({
  data: { contentfulPageMetadata: meta },
  pageContext: { language },
}) => {
  return (
    <SEO
      htmlLang={language}
      title={meta?.metaTitle}
      description={meta?.metaDescription}
      image={meta?.metaImage?.url}
      path="contacts"
      alternateParams={undefined}
    />
  );
};

export const query = graphql`
  query ContactsPage($language: String) {
    allContentfulLabel(
      filter: { contentfulid: { in: ["contacts-page-title"] }, node_locale: { eq: $language } }
    ) {
      nodes {
        contentfulid
        value
        node_locale
      }
    }
    contentfulHeroBanner(handler: { eq: "contacts-page" }, node_locale: { eq: $language }) {
      image {
        gatsbyImageData
      }
      description {
        raw
      }
      title
      subtitle
    }

    contentfulPageMetadata(handler: { eq: "contacts" }, node_locale: { eq: $language }) {
      ...Metadata
    }
  }
`;
