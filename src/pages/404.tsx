import { Button, Text, Title } from "@biesse-group/react-components";
import { HeadFC, PageProps } from "gatsby";
import React from "react";
import styled from "styled-components";

import { useLayoutContext } from "../components/Layout/layoutContext";
import { Link } from "../components/Link";
import { useLabels } from "../hooks/useLabels";
import { translatePath } from "../i18n/localize-path";

const Root = styled.div`
  padding: 120px 0;
  text-align: center;
`;

const NotFoundPage: React.FC<PageProps<Queries.Query, { isDefault?: boolean }>> = () => {
  const labels = useLabels([
    "page-not-found-title",
    "page-not-found-description",
    "page-not-found-back-home",
  ]);
  const { language } = useLayoutContext();
  return (
    <Root>
      <Title variant="h1" color="primary">
        404
      </Title>
      <Title variant="h2" size="md" color="primary">
        {labels["page-not-found-title"]}
      </Title>
      <Text tag="p" style={{ marginBottom: 30 }}>
        {labels["page-not-found-description"]}
      </Text>
      <Link to={translatePath({ path: "/", language })}>
        <Button variant="outline" leftIcon="arrow-left">
          {labels["page-not-found-back-home"]}
        </Button>
      </Link>
    </Root>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Not found</title>;
