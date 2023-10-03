import { Button, Modal, useModal } from "@biesse-group/react-components";
import { graphql, HeadProps, navigate, PageProps } from "gatsby";
import React, { FC, useEffect } from "react";
import styled from "styled-components";

import { GenericModalForm } from "../components/forms/GenericModalForm";
import { InterestFieldType } from "../components/forms/models/interest-field-type";
import { EventHeaderChild } from "../components/news-and-events/events/EventHeaderChild";
import { NewsAndEventsBody } from "../components/news-and-events/NewsAndEventsBody";
import { PageHeader } from "../components/PageHeader";
import { SEO } from "../components/Seo/Seo";
import { mailtoConfig } from "../config/mailto-config";
import { PageType, SiteArea, useDataLayer, useTrackPageview } from "../hooks/data-layer";
import { useTrackEventTicketRequest } from "../hooks/data-layer/useTrackEventTicketRequest";
import { useLabels } from "../hooks/useLabels";
import { useLocalizedPath } from "../hooks/useLocalizedPath";

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
`;

const NewsDetail: FC<PageProps<Queries.EventDetailQuery, { slug: string }>> = ({
  data: { contentfulEvent: event },
}) => {
  const newsEventsPath = useLocalizedPath("news-and-events");
  const labels = useLabels([
    "news-detail-back",
    "info-form-request-success",
    "info-form-modal-description",
  ]);

  const trackPageview = useTrackPageview();
  useEffect(() => {
    trackPageview({
      page_type: PageType.Events,
      site_area: SiteArea.NewsAndEvents,
      breadcrumbs: null,
      material: null,
      technology: null,
      line: null,
    });
  }, [trackPageview]);

  const { pushEvent } = useDataLayer();
  useEffect(() => {
    pushEvent({
      event: "news_view",
      news_name: event?.originalEntry?.eventName ?? event?.eventName ?? "",
    });
  }, [event, pushEvent]);

  const onTrackEventTicketRequest = useTrackEventTicketRequest();
  const { isOpen, close, open } = useModal();

  return event ? (
    <StyledRoot>
      <PageHeader
        image={event.image?.gatsbyImageData}
        title={event.eventName ?? ""}
        backLabel={labels["news-detail-back"]}
        onBack={() => navigate(newsEventsPath)}
        abstract={<EventHeaderChild event={event} />}
        action={
          event.ctaLabel && (
            <>
              <Button variant="primary" onClick={open}>
                {event.ctaLabel ?? ""}
              </Button>
              <Modal isOpen={isOpen} close={close}>
                <GenericModalForm
                  onPostSuccess={(payload) => onTrackEventTicketRequest(payload, event)}
                  title={event.eventName ?? ""}
                  description={labels["info-form-modal-description"] || ""}
                  interestFieldId={InterestFieldType.EVENT_TICKET}
                  onClose={close}
                  successMessage={labels["info-form-request-success"] || ""}
                  leadMessage={`Event Ticket: ${event.eventName ?? ""}`}
                  mailTitle={event.eventName ? `Ticket: ${event.eventName}` : undefined}
                  mailAddress={mailtoConfig.newsletterAddress}
                />
              </Modal>
            </>
          )
        }
      />
      <NewsAndEventsBody contentfulElement={event} />
    </StyledRoot>
  ) : null;
};

export default NewsDetail;

export const Head: FC<HeadProps<Queries.EventDetailQuery, { language: string }>> = ({
  data: { contentfulEvent: event, slugs },
  pageContext: { language },
}) => {
  const alternateParams = slugs.nodes.reduce(
    (acc, { slug, node_locale }) => ({ ...acc, [node_locale]: { slug } }),
    {} as any
  );
  return (
    <SEO
      alternateParams={alternateParams}
      htmlLang={language}
      title={event?.metaTitle ?? event?.eventName}
      description={event?.metaDescription}
      image={event?.image?.url}
      path="events/{slug}"
    />
  );
};

export const query = graphql`
  query EventDetail($slug: String, $language: String, $contentful_id: String) {
    slugs: allContentfulEvent(filter: { contentful_id: { eq: $contentful_id } }) {
      nodes {
        slug
        node_locale
      }
    }
    contentfulEvent(slug: { eq: $slug }, node_locale: { eq: $language }) {
      eventName
      image {
        gatsbyImageData
        url
      }
      metaTitle
      metaDescription
      ctaLabel
      originalEntry {
        eventName
      }
      ...EventHeaderChild
      ...EventBody
    }
  }
`;
