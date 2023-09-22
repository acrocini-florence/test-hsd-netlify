import {
  type BaseProps,
  Button,
  EventCard as EventCardBase,
  EventCardProps as EventCardBaseProps,
} from "@biesse-group/react-components";
import dayjs from "dayjs";
import { graphql, navigate } from "gatsby";
import React, { FC } from "react";
import styled from "styled-components";

import { useLabels } from "../../../hooks/useLabels";
import { useLocalizedPath } from "../../../hooks/useLocalizedPath";
import { actionHoverTransition } from "../../../styles";
import { useLayoutContext } from "../../Layout/layoutContext";
import { UnstyledLink } from "../../Link";
import { RichText } from "../../RichText";

const StyledButton = styled(Button)``;

const StyledEventCard = styled(EventCardBase)`
  &:hover {
    ${StyledButton} {
      ${actionHoverTransition}
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  height: 100%;
`;

export interface EventCardProps extends BaseProps, Pick<EventCardBaseProps, "variant" | "onClick"> {
  event: Queries.EventCardFragment;
}

export const EventCard: FC<EventCardProps> = ({
  event,
  variant = "primary",
  className,
  onClick,
}) => {
  const { language } = useLayoutContext();
  const labels = useLabels(["event-receive-ticket-button", "event-read-more-button"]);
  const localizedPath = useLocalizedPath("events/{slug}", { slug: event.slug });

  const handleClick: EventCardBaseProps["onClick"] = (e) => {
    navigate(localizedPath);
    onClick?.(e);
  };

  return (
    <StyledEventCard
      title={
        event.placeholderEvent ? (
          event.eventName ?? ""
        ) : (
          <UnstyledLink to={localizedPath}>{event.eventName}</UnstyledLink>
        )
      }
      onClick={!event.placeholderEvent ? handleClick : undefined}
      description={
        variant !== "secondary" ? (
          <RichText variant={variant === "hero" ? "light" : "dark"} raw={event.abstract?.raw} />
        ) : undefined
      }
      startDate={dayjs(event.startDate).locale(language)}
      endDate={dayjs(event.endDate).locale(language)}
      variant={variant}
      location={event.locationAddress ?? undefined}
      className={className}
    >
      {!event.placeholderEvent && (
        <ButtonContainer>
          <StyledButton variant="primary-naked" size="small" rightIcon="chevron-right">
            {labels["event-read-more-button"]}
          </StyledButton>
        </ButtonContainer>
      )}
    </StyledEventCard>
  );
};

export const query = graphql`
  fragment EventCard on ContentfulEvent {
    eventName
    slug
    placeholderEvent
    abstract {
      raw
    }
    endDate
    startDate
    slug
    locationAddress
  }
`;
