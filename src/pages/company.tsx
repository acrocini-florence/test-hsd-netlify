import { Modal, useModal, VideoPlayer } from "@biesse-group/react-components";
import { graphql, HeadProps, navigate, PageProps } from "gatsby";
import React, { FC, useEffect, useState } from "react";

import { CompanyHeaderImages } from "../components/company/CompanyHeaderImages";
import { CompanyServiceNetworkSection } from "../components/company/CompanyServiceNetworkSection";
import { SustainabilityBox } from "../components/company/SustainabilityBox";
import { RequestInfoForm } from "../components/forms/RequestInfoForm";
import { PageHeader } from "../components/PageHeader";
import { PlayVideoButton } from "../components/PlayVideoButton";
import { RichText } from "../components/RichText";
import { Section } from "../components/Section";
import { SEO } from "../components/Seo/Seo";
import { PageType, SiteArea, useDataLayer, useTrackPageview } from "../hooks/data-layer";
import { useLocalizedPath } from "../hooks/useLocalizedPath";

const CompanyPage: FC<PageProps<Queries.CompanyPageQuery>> = ({
  data: { contentfulHeroBanner: header, allContentfulPresentationCard: cards },
}) => {
  // In case they rollback to the RequestInfoForm version
  // const [infoFormRef, setInfoFormRef] = useRefWithCallback<HTMLDivElement>();

  // const handleOnAskInfo = useCallback(() => {
  //   if (infoFormRef.current) {
  //     infoFormRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [infoFormRef]);

  const trackPageview = useTrackPageview();
  useEffect(() => {
    trackPageview({
      page_type: PageType.Company,
      site_area: SiteArea.Company,
      breadcrumbs: null,
      material: null,
      technology: null,
      line: null,
    });
  }, [trackPageview]);

  const contactsPath = useLocalizedPath("contacts");

  const handleOnAskInfo = () => {
    navigate(contactsPath);
  };

  const { pushEvent } = useDataLayer();
  const [isPlayTracked, setIsPlayTracked] = useState(false);
  const { isOpen, close, open } = useModal();

  return (
    <div>
      {header && (
        <PageHeader
          image={<CompanyHeaderImages images={[header.image, header.secondaryImage]} />}
          title={header.title ?? ""}
          subtitle={header.subtitle ?? undefined}
          titleUppercase
          abstract={<RichText raw={header.description?.raw} />}
          action={
            <>
              {header.video?.url && (
                <>
                  <PlayVideoButton onClick={open} />
                  <Modal isOpen={isOpen} close={close}>
                    <div style={{ height: "100%" }}>
                      <VideoPlayer
                        variant="fit"
                        autoPlay={true}
                        url={header.video.url}
                        mimeType={header.video.mimeType}
                        onChangePlayStatus={(isPlaying) => {
                          if (isPlaying && !isPlayTracked) {
                            pushEvent({
                              event: "view_video",
                              video_name: "company",
                            });
                            setIsPlayTracked(true);
                          }
                        }}
                      />
                    </div>
                  </Modal>
                </>
              )}
            </>
          }
        />
      )}
      <Section>
        <CompanyServiceNetworkSection action={handleOnAskInfo} />
      </Section>
      <Section horizontalSpace={false}>
        <Section $backgroundColor="lightGray">
          <SustainabilityBox cards={cards.nodes} />
        </Section>
      </Section>
      <Section horizontalSpace={false}>
        <RequestInfoForm
          pageType={PageType.Company}
          productCode={null}
          style={{ marginBottom: 30 }}
        />
      </Section>
    </div>
  );
};

export default CompanyPage;

export const Head: FC<HeadProps<Queries.CompanyPageQuery, { language: string }>> = ({
  data: { contentfulPageMetadata: meta },
  pageContext: { language },
}) => {
  return (
    <SEO
      htmlLang={language}
      title={meta?.metaTitle}
      description={meta?.metaDescription}
      image={meta?.metaImage?.url}
      path="company"
      alternateParams={undefined}
    />
  );
};

export const query = graphql`
  query CompanyPage($language: String) {
    contentfulHeroBanner(handler: { eq: "company-page" }, node_locale: { eq: $language }) {
      image {
        ...CompanyHeaderImage
      }
      description {
        raw
      }
      title
      subtitle
      secondaryImage {
        ...CompanyHeaderImage
      }
      video {
        url
        mimeType
      }
    }

    allContentfulPresentationCard(
      filter: {
        handler: { in: ["company-page-1", "company-page-2", "company-page-3"] }
        node_locale: { eq: $language }
      }
    ) {
      nodes {
        ...CompanyCard
      }
    }

    contentfulPageMetadata(handler: { eq: "company" }, node_locale: { eq: $language }) {
      ...Metadata
    }
  }
`;
