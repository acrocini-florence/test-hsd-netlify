// import { PartnerCarousel as PartnerCarouselBase } from "@biesse-group/react-components";
// import { graphql } from "gatsby";
// import { GatsbyImage } from "gatsby-plugin-image";
// import React, { FC } from "react";
// import styled from "styled-components";

// const StyledGatsbyImg = styled(GatsbyImage)`
//   pointer-events: none;
// `;

// export const PartnerCarousel: FC<{ carousel: Queries.PartnerCarouselFragment }> = ({
//   carousel,
// }) => {
//   return (
//     <PartnerCarouselBase
//       title="Partners"
//       partners={(carousel.partnersList ?? []).map((partner, index) => (
//         <StyledGatsbyImg image={partner!.logo!.gatsbyImageData!} alt="Partner Logo" key={index} />
//       ))}
//     />
//   );
// };

// export const query = graphql`
//   fragment PartnerCarousel on ContentfulPartnerCarousel {
//     partnersList {
//       logo {
//         gatsbyImageData
//         mimeType
//         url
//       }
//     }
//   }
// `;

export {};
