import {
  Modal,
  mqUntil,
  Quote,
  StripThreeCols,
  StripThreeColsProps,
  useModal,
  VideoPlayer,
} from "@biesse-group/react-components";
import { graphql, HeadProps, navigate, PageProps } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC, useEffect, useState } from "react";
import styled, { css } from "styled-components";

import { CaseHistoryRelated } from "../components/case-history/CaseHistoryRelated";
import { MaterialTag, MaterialTagProps } from "../components/MaterialTag";
import { PageHeader } from "../components/PageHeader";
import { PlayVideoButton } from "../components/PlayVideoButton";
import { RichText } from "../components/RichText";
import { Section } from "../components/Section";
import { SEO } from "../components/Seo/Seo";
import { PageType, SiteArea, useDataLayer, useTrackPageview } from "../hooks/data-layer";
import { useLabels } from "../hooks/useLabels";
import { useLocalizedPath } from "../hooks/useLocalizedPath";

const AbstractContainer = styled.div`
  width: calc(2 / 3 * 100%);

  ${mqUntil(
    "md",
    css`
      width: 100%;
    `
  )}
`;

const StyledAbstract = styled(RichText)`
  line-height: 30px;

  ${mqUntil(
    "md",
    css`
      line-height: 26px;
    `
  )}
`;

const StyledGatsbyImage = styled(GatsbyImage)`
  width: 100%;
  height: 250px;
  border-bottom-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const ProjectDetail: FC<PageProps<Queries.ProjectDetailQuery, { slug: string }>> = ({
  data: { contentfulProject: project },
}) => {
  const trackPageview = useTrackPageview();
  const { pushEvent } = useDataLayer();
  const projectName = project?.projectName;
  useEffect(() => {
    trackPageview({
      site_area: SiteArea.CaseHistory,
      page_type: PageType.Project,
      breadcrumbs: null,
      material: null,
      technology: null,
      line: null,
    });
    pushEvent({
      event: "case_history_view",
      case_history_name: projectName,
    });
  }, [projectName, pushEvent, trackPageview]);

  const caseHistoryPath = useLocalizedPath("case-history");

  const labels = useLabels(["project-page-back"]);
  const [isPlayTracked, setIsPlayTracked] = useState(false);
  const { isOpen, close, open } = useModal();

  return project ? (
    <div>
      <PageHeader
        tags={project.materials?.map((e, index) => (
          <MaterialTag key={index} material={e?.key as MaterialTagProps["material"]} />
        ))}
        image={project.image?.gatsbyImageData}
        title={project.projectName ?? ""}
        backLabel={labels["project-page-back"]}
        onBack={() => navigate(caseHistoryPath)}
        action={
          <>
            {project.video?.url && (
              <>
                <PlayVideoButton onClick={open} />
                <Modal isOpen={isOpen} close={close}>
                  {project.video.url && (
                    <div style={{ height: "100%" }}>
                      <VideoPlayer
                        variant="fit"
                        autoPlay={true}
                        onChangePlayStatus={(isPlaying) => {
                          if (isPlaying && !isPlayTracked) {
                            pushEvent({
                              event: "view_video",
                              video_name: projectName,
                            });
                            setIsPlayTracked(true);
                          }
                        }}
                        url={project.video.url}
                        mimeType={project.video.mimeType}
                      />
                    </div>
                  )}
                </Modal>
              </>
            )}
          </>
        }
      />
      {project.abstract && (
        <Section>
          <AbstractContainer>
            <StyledAbstract size="lg" raw={project.abstract?.raw} />
          </AbstractContainer>
        </Section>
      )}
      {project.secondaryImages?.length && (
        <Section>
          <StripThreeCols
            variant="1-1-1"
            tabletBehavior="maintain-proportion"
            mobileBehavior="scroll"
            items={
              project.secondaryImages.map(
                (image, index) =>
                  image?.gatsbyImageData && (
                    <StyledGatsbyImage
                      alt={image.description ?? image.title ?? ""}
                      image={image.gatsbyImageData}
                      key={index}
                    />
                  )
              ) as StripThreeColsProps["items"]
            }
          />
        </Section>
      )}
      {project.quote?.quote?.quote && (
        <Section horizontalSpace={false}>
          <Quote
            citation={project.quote.quote.quote}
            authorName={project.quote.author || ""}
            authorDescription={project.quote.authorRole || ""}
          />
        </Section>
      )}
      <Section style={{ marginBottom: "100px" }}>
        <CaseHistoryRelated
          partners={project.linkedPartners as Queries.ContentfulPartner[]}
          products={project.linkedProducts as Queries.ContentfulProduct[]}
        />
      </Section>
    </div>
  ) : null;
};

export default ProjectDetail;

export const Head: FC<HeadProps<Queries.ProjectDetailQuery, { language: string }>> = ({
  pageContext: { language },
  data: { contentfulProject: project, slugs },
}) => {
  const alternateParams = slugs.nodes.reduce(
    (acc, { slug, node_locale }) => ({ ...acc, [node_locale]: { slug } }),
    {} as any
  );
  return (
    <SEO
      path="case-history/{slug}"
      alternateParams={alternateParams}
      htmlLang={language}
      title={project?.metaTitle ?? project?.projectName}
      description={project?.metaDescription}
      image={project?.image?.url}
    />
  );
};

export const query = graphql`
  query ProjectDetail($slug: String, $language: String, $contentful_id: String) {
    slugs: allContentfulProject(filter: { contentful_id: { eq: $contentful_id } }) {
      nodes {
        slug
        node_locale
      }
    }
    contentfulProject(slug: { eq: $slug }, node_locale: { eq: $language }) {
      video {
        url
        mimeType
      }
      image {
        gatsbyImageData
        url
      }
      materials {
        ...MaterialData
      }
      projectName
      metaTitle
      metaDescription
      abstract {
        raw
      }
      quote {
        author
        authorRole
        quote {
          quote
        }
      }
      secondaryImages {
        gatsbyImageData
        title
        description
      }
      linkedPartners {
        logo {
          gatsbyImageData
        }
        name
        abstract {
          raw
        }
      }
      linkedProducts {
        image {
          gatsbyImageData
          description
        }
        productCode
        slug
        description {
          raw
        }
      }
    }
  }
`;
