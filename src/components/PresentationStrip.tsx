// import {
//   Button,
//   IconCard,
//   mqUntil,
//   StripThreeCols,
//   StripThreeColsProps,
//   Title,
// } from "@biesse-group/react-components";
// import { graphql, useStaticQuery } from "gatsby";
// import React, { FC } from "react";
// import styled, { css } from "styled-components";

// import { useLabels } from "../hooks/useLabels";
// import { ContentfulImage } from "./ContentfulImage";
// import { RichText } from "./RichText";

// const PresentationMainWrapper = styled.div`
//   display: inline-flex;
//   flex-direction: column;
//   max-width: 560px;

//   ${mqUntil(
//     "sm",
//     css`
//       margin-bottom: 60px;
//     `
//   )}
// `;

// const StyledTitle = styled(Title)`
//   margin: 0px;
// `;

// const StyledButton = styled(Button)`
//   margin-top: 20px;
// `;

// export const PresentationStrip: FC<{ presentation: Queries.PresentationStripFragment }> = ({
//   presentation,
// }) => {
//   const labels = useLabels(["presentation-read-more-button"]);

//   try {
//     if (!presentation.items || !presentation.items[0]) {
//       throw new Error(
//         "Something wen wrong with number of elements. \nContentful should not allow it."
//       );
//     }

//     const items: StripThreeColsProps["items"] = [
//       <PresentationMainWrapper key="main">
//         <StyledTitle variant="h1" color="primary">
//           {presentation.title}
//         </StyledTitle>
//         <Title variant="h3" color="primary">
//           {presentation.subtitle}
//         </Title>
//         <RichText raw={presentation.description?.raw} />
//       </PresentationMainWrapper>,
//     ];

//     const secondaryItems = presentation.items.map((presentationItem, index) => {
//       if (presentationItem) {
//         return (
//           <IconCard
//             key={index}
//             action={
//               <StyledButton variant="outline">
//                 {labels["presentation-read-more-button"]}
//               </StyledButton>
//             }
//             description={
//               presentationItem.description?.raw ? (
//                 <RichText raw={presentationItem.description?.raw!} />
//               ) : (
//                 ""
//               )
//             }
//             title={presentationItem.title!}
//             icon={
//               <ContentfulImage
//                 image={presentationItem.icon! as Queries.ContentfulAsset}
//                 alt={presentationItem.title!}
//                 style={{ width: "100%" }}
//               />
//             }
//           />
//         );
//       } else return undefined;
//     });

//     items.push(...secondaryItems);

//     return <StripThreeCols title="" items={items} />;
//   } catch (e) {
//     return <></>;
//   }
// };

// export const query = graphql`
//   fragment PresentationStrip on ContentfulPresentationStrip {
//     id
//     title
//     subtitle
//     description {
//       raw
//     }
//     items {
//       description {
//         raw
//       }
//       title
//       icon {
//         gatsbyImageData
//         mimeType
//         url
//       }
//     }
//   }
// `;

export {};
