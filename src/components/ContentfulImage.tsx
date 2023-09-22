import { graphql } from "gatsby";
import { GatsbyImage, GatsbyImageProps } from "gatsby-plugin-image";
import React, { DetailedHTMLProps, FC, HTMLAttributes, ObjectHTMLAttributes } from "react";

import { toAbsoluteUrl } from "../utils/url";

interface CommonImgProps
  extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> {}

export interface ContentfulImageProps extends CommonImgProps {
  alt?: string;
  image: Queries.ContentfulImageDataFragment;
  gatsbyImageProps?: Partial<GatsbyImageProps>;
  svgImageProps?: Partial<
    DetailedHTMLProps<ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>
  >;
}

export const ContentfulImage: FC<ContentfulImageProps> = ({
  image,
  alt,
  onLoad,
  onError,
  gatsbyImageProps,
  svgImageProps,
  ...rest
}) => {
  if (image.mimeType === "image/svg+xml") {
    const absoluteImgUrl =
      image.url || image.publicUrl ? toAbsoluteUrl(image.url || image.publicUrl || "") : undefined;
    return (
      <object
        data={absoluteImgUrl}
        {...rest} // common props
        {...{ onLoad, onError }} // these are redefined by GatsbyImage with a different signature
        {...svgImageProps} // specific svg props
      >
        {alt || ""}
      </object>
    );
  } else if (image.gatsbyImageData) {
    return (
      <GatsbyImage
        alt={alt || ""}
        image={image.gatsbyImageData}
        {...rest} // common props
        {...gatsbyImageProps} // specific GatsbyImage props
      />
    );
  } else {
    return <></>;
  }
};

export const query = graphql`
  fragment ContentfulImageData on ContentfulAsset {
    gatsbyImageData
    contentful_id
    publicUrl
    url
    mimeType
  }
`;
