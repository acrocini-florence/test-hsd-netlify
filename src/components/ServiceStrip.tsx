// import {
//   Button,
//   HorizontalCard,
//   StripThreeCols,
//   StripThreeColsProps,
// } from "@biesse-group/react-components";
// import { graphql, useStaticQuery } from "gatsby";
// import { GatsbyImage } from "gatsby-plugin-image";
// import React, { FC } from "react";

// import { useLabels } from "../hooks/useLabels";
// import { ContentfulImage } from "./ContentfulImage";
// import { RichText } from "./RichText";

// export interface ServiceStripProps {
//   serviceStrip: Queries.ServiceStripFragment;
// };

// export const ServiceStrip: FC<ServiceStripProps> = ({ serviceStrip }) => {
//   const labels = useLabels(["service-read-more-button"] );

//   try {
//     if (!serviceStrip.services || !serviceStrip.services[0]) {
//       throw new Error(
//         "Something wen wrong with number of elements. \nContentful should not allow it."
//       );
//     }

//     const items = serviceStrip.services?.map((service, index) => {
//       if (service) {
//         return (
//           <HorizontalCard
//             key={index}
//             title={service.serviceName!}
//             description={<RichText raw={service?.abstract?.raw} />}
//             icon={
//               <ContentfulImage
//                 image={service.icon! as Queries.ContentfulAsset}
//                 alt={service.serviceName!}
//                 style={{ width: "50px" }}
//               />
//             }
//             image={
//               service.image ? (
//                 <GatsbyImage
//                   image={service.image.gatsbyImageData!}
//                   alt={service.serviceName!}
//                   objectFit="cover"
//                   style={{ height: "100%" }}
//                 />
//               ) : undefined
//             }
//             actions={<Button variant="outline">{labels["service-read-more-button"]}</Button>}
//           />
//         );
//       } else {
//         return undefined;
//       }
//     });
//     return (
//       <StripThreeCols
//         title={serviceStrip.title!}
//         mobileBehavior="scroll"
//         items={items as StripThreeColsProps["items"]}
//       />
//     );
//   } catch (e) {
//     return <></>;
//   }
// };

// export const query = graphql`
//   fragment ServiceStrip on ContentfulServiceStrip {
//     title
//     services {
//       image {
//         gatsbyImageData
//         mimeType
//         url
//       }
//       serviceName
//       abstract {
//         raw
//       }
//       icon {
//         gatsbyImageData
//         mimeType
//         url
//       }
//     }
//   }
// `;

export {};
