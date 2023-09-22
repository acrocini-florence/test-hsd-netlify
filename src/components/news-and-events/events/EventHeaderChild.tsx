import { Icon, mqUntil, Text } from "@biesse-group/react-components";
import dayjs from "dayjs";
import { graphql } from "gatsby";
import React, { FC } from "react";
import styled, { css } from "styled-components";

import { httpConfig } from "../../../config/http-config";
import { useLabels } from "../../../hooks/useLabels";
import { useLayoutContext } from "../../Layout/layoutContext";

const Root = styled.div`
  margin-top: 42px;
  margin-bottom: 10px;
  min-height: 190px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${mqUntil(
    "sm",
    css`
      margin-top: 10px;
    `
  )}
`;

const Row = styled.div`
  display: inline-flex;
  gap: 20px;
  align-items: center;
`;

const DateWrapper = styled.div`
  display: inline-flex;
  gap: 5px;
  align-items: baseline;
  ${mqUntil(
    "sm",
    css`
      flex-direction: column;
    `
  )}
`;

const InnerDateWrapper = styled.div`
  display: inline-flex;
  gap: 5px;
  align-items: baseline;
  flex-wrap: nowrap;
`;

const BiggerFontText = styled(Text)`
  font-size: 24px;
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
`;

const StyledMapLink = styled(Text)`
  text-decoration: underline;
  text-transform: uppercase;
  margin-left: 30px;
  margin-right: 10px;
`;

export interface EventHeaderChildProps {
  event: Queries.EventHeaderChildFragment;
}

export const EventHeaderChild: FC<EventHeaderChildProps> = ({ event }) => {
  const labels = useLabels([
    "event-page-map",
    "event-page-hall",
    "event-page-pavilion",
    "event-detail-location-title",
  ]);

  const { language } = useLayoutContext();

  const startDate = event?.startDate ? dayjs(event.startDate).locale(language) : undefined;
  const endDate = event?.endDate ? dayjs(event.endDate).locale(language) : undefined;

  return (
    <Root>
      <Row>
        <Icon color="primary" name="calendar" size="30px" />
        <DateWrapper>
          <InnerDateWrapper>
            <BiggerFontText size="xl" weight="bold">
              {startDate?.format("DD")}
            </BiggerFontText>
            <Text size="lg" responsive={false}>
              {startDate?.format("MMMM YYYY")}
              {endDate && " / "}
            </Text>
          </InnerDateWrapper>
          <InnerDateWrapper>
            <BiggerFontText size="xl" weight="bold">
              {endDate?.format("DD")}
            </BiggerFontText>
            <Text size="lg" responsive={false}>
              {endDate?.format("MMMM YYYY")}
            </Text>
          </InnerDateWrapper>
        </DateWrapper>
      </Row>
      <Row>
        <Icon color="primary" name="location" size="30px" />
        <LocationGrid>
          <BiggerFontText size="xl" weight="bold">
            {event.locationTitle ?? labels["event-detail-location-title"]}
          </BiggerFontText>
          {event.locationAddress && (
            <>
              <div />
              <Text size="lg" responsive={false}>
                {event.locationAddress}
              </Text>
              <a
                href={`${httpConfig.googleMapsApi}${event.locationAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                <StyledMapLink color="primary" weight="bold">
                  {labels["event-page-map"] ?? "Map"}
                </StyledMapLink>
              </a>
            </>
          )}
        </LocationGrid>
      </Row>
      {event.hall && event.pavilion && (
        <Row>
          <Icon color="primary" name="pavilion" size="30px" />
          <Text size="lg" responsive={false}>
            {labels["event-page-hall"]} <b>{`${event.hall}`}</b> - {labels["event-page-pavilion"]}{" "}
            <b>{`${event.pavilion}`}</b>
          </Text>
        </Row>
      )}
    </Root>
  );
};

export const query = graphql`
  fragment EventHeaderChild on ContentfulEvent {
    startDate
    endDate
    hall
    pavilion
    locationAddress
    locationTitle
  }
`;
