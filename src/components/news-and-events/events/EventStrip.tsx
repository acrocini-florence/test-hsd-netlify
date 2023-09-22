import { StripThreeCols } from "@biesse-group/react-components";
import { graphql } from "gatsby";
import React, { FC } from "react";
import styled from "styled-components";

import { EventCard } from "./EventCard";

export interface EventStripProps {
  eventStrip: Queries.EventStripFragment;
}

const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
`;

export const EventStrip: FC<EventStripProps> = ({ eventStrip }) => {
  const { events } = eventStrip;

  return events && events.length > 0 && !!events[0] ? (
    <StripThreeCols
      title={eventStrip.title ?? ""}
      variant="2-1-1"
      mobileBehavior="wrap"
      items={[
        <EventCard event={events[0]} key="main" />,
        events.length > 1 ? (
          <EventsContainer key="secondary-1">
            {events
              .slice(1, 3)
              .map(
                (event) => event && <EventCard key={event.slug} event={event} variant="secondary" />
              )}
          </EventsContainer>
        ) : undefined,
        events.length > 3 ? (
          <EventsContainer key="secondary-2">
            {events
              .slice(3, 5)
              .map(
                (event) => event && <EventCard key={event.slug} event={event} variant="secondary" />
              )}
          </EventsContainer>
        ) : undefined,
      ]}
    />
  ) : null;
};

export const query = graphql`
  fragment EventStrip on ContentfulEventStrip {
    title
    events {
      ...EventCard
    }
  }
`;
