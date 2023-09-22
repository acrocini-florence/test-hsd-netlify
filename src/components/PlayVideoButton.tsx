import { PlayButton, Title } from "@biesse-group/react-components";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import styled from "styled-components";

import { useLabels } from "../hooks/useLabels";

const Root = styled.div`
  display: inline-flex;
  align-items: center;
  height: 60px;
  cursor: pointer;
`;

const StyledPlayButton = styled(PlayButton)`
  width: 60px;
  height: 60px;
`;

const StyledButtonText = styled(Title)`
  margin-bottom: 0px;
  margin-left: 10px;
`;

export interface PlayVideoButtonProps
  extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> {}

export const PlayVideoButton = React.forwardRef<HTMLDivElement, PlayVideoButtonProps>(
  (props, ref) => {
    const labels = useLabels(["project-page-watch-video"]);

    return (
      <Root ref={ref} {...props}>
        <StyledPlayButton aria-label="play video" variant="inverted" />
        <StyledButtonText variant="h4" color="primary">
          {labels["project-page-watch-video"]}
        </StyledButtonText>
      </Root>
    );
  }
);
