import { StripThreeCols, StripThreeColsProps, TitleProps } from "@biesse-group/react-components";
import { graphql } from "gatsby";
import React, { FC } from "react";

import { ProjectCard } from "./ProjectCard";

export interface ProjectStripProps
  extends Pick<StripThreeColsProps, "titleTag" | "variant" | "mobileBehavior"> {
  projectStrip: Queries.ProjectStripFragment;
  withTitle?: boolean;
  projectCardTitleTag?: TitleProps["variant"];
}

export const ProjectStrip: FC<ProjectStripProps> = ({
  projectStrip,
  variant,
  mobileBehavior = "scroll",
  withTitle = true,
  titleTag,
  projectCardTitleTag = "h3",
}) => {
  try {
    if (!projectStrip.projects || !projectStrip.projects[0]) {
      throw new Error(
        "Something wen wrong with number of elements. \nContentful should not allow it."
      );
    }

    const items = projectStrip.projects.map((project, index, array) =>
      project ? (
        <ProjectCard
          key={index}
          project={project}
          direction={array.length === 1 ? "horizontal" : "vertical"}
          titleSize={index > 0 ? "small" : "default"}
          titleTag={projectCardTitleTag}
        />
      ) : undefined
    );

    return (
      <StripThreeCols
        title={(withTitle && projectStrip.title) || undefined}
        items={items as StripThreeColsProps["items"]}
        {...{ mobileBehavior, variant, titleTag }}
      />
    );
  } catch (e) {
    return <></>;
  }
};

export const query = graphql`
  fragment ProjectStrip on ContentfulProjectStrip {
    title
    projects {
      ...ProjectCard
    }
  }
`;
