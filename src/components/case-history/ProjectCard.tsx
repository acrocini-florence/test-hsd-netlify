import { Button, Card, CardProps } from "@biesse-group/react-components";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { FC } from "react";

import { useLabels } from "../../hooks/useLabels";
import { translatePath } from "../../i18n/localize-path";
import { useLayoutContext } from "../Layout/layoutContext";
import { Link } from "../Link";
import { MaterialTag, MaterialTagProps } from "../MaterialTag";

export interface ProjectCardProps extends Pick<CardProps, "direction" | "titleSize" | "titleTag"> {
  project: Queries.ProjectCardFragment;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project, ...props }) => {
  const labels = useLabels(["project-read-more-button"]);
  const { language } = useLayoutContext();

  const renderProjectLink = (children: React.ReactNode) => (
    <Link
      to={translatePath({ path: "case-history/{slug}", language, params: { slug: project.slug } })}
    >
      {children}
    </Link>
  );

  return (
    <Card
      image={
        project.image?.gatsbyImageData && (
          <GatsbyImage image={project.image.gatsbyImageData} alt={project.projectName ?? ""} />
        )
      }
      title={renderProjectLink(project.projectName ?? "")}
      tags={(project.materials || []).map((material, index) => (
        <MaterialTag key={index} material={material?.key as MaterialTagProps["material"]} border />
      ))}
      action={renderProjectLink(
        <Button variant="primary-naked" size="small" rightIcon="chevron-right">
          {labels["project-read-more-button"]}
        </Button>
      )}
      {...props}
    />
  );
};

export const query = graphql`
  fragment ProjectCard on ContentfulProject {
    projectName
    slug
    materials {
      ...MaterialData
    }
    image {
      gatsbyImageData
    }
    abstract {
      raw
    }
  }
`;
