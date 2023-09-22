import { ContentTypeConfig } from "./types";

export function toGQLContentTypeHeader(contentTypeConfig: ContentTypeConfig) {
  return [
    `# ${contentTypeConfig.name}`,
    contentTypeConfig.description && `# ${contentTypeConfig.description}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function toGQLContentTypeName(name: string) {
  return `Contentful${capitalized(name)}`;
}

export function capitalized(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function firstLetterToLowerCase(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function getSysTypes(gqlContentTypeName: string) {
  return `
    type ${gqlContentTypeName}SysContentType {
      sys: ${gqlContentTypeName}SysContentTypeSys
    }

    type ${gqlContentTypeName}Sys {
      type: String
      revision: Int
      contentType: ${gqlContentTypeName}SysContentType
    }

    type ${gqlContentTypeName}SysContentTypeSys {
      type: String
      linkType: String
      id: String
    }`.replace(/^ {4}/gm, "");
}

export function getNodeFields(gqlContentTypeName: string) {
  return `
    createdAt: Date
    updatedAt: Date
    spaceId: String
    parent: Node
    children: [Node!]!
    internal: Internal!
    sys: ${gqlContentTypeName}Sys
  `.replace(/^ {2}/gm, "");
}
