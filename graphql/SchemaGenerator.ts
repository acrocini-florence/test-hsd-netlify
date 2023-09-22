import fs from "fs";
import path from "path";

import {
  BaseFieldType,
  ContentTypeConfig,
  FieldConfig,
  FieldDefinitionObject,
  FieldItemsType,
} from "./types";
import {
  capitalized,
  firstLetterToLowerCase,
  getNodeFields,
  getSysTypes,
  toGQLContentTypeHeader,
  toGQLContentTypeName,
} from "./utils";

export interface SchemaGeneratorConfig {
  isVerbose: boolean;
  url: string;
  generatedDir?: string;
  baseDir: string;
  updateObjectTypes?: boolean;
}

export class SchemaGenerator {
  private config: SchemaGeneratorConfig;
  // This will hold the union types that cannot be defined inline
  private collectedUnions: string[];
  // Text fields require a second level, with a dedicated type
  private textFields: string[];
  // Object fields require a second level, with a dedicated type
  private retrievedObjectFields: Array<{
    fieldConfig: FieldConfig;
    contentTypeConfig: ContentTypeConfig;
  }>;

  constructor(config: SchemaGeneratorConfig) {
    this.config = config;
    this.collectedUnions = [];
    this.textFields = [];
    this.retrievedObjectFields = [];
  }

  private getBuiltinTypesPath() {
    return path.resolve(path.join(this.config.baseDir, "builtin-types.gql"));
  }

  private getCustomTypesPath() {
    return path.resolve(path.join(this.config.baseDir, "custom-types.gql"));
  }

  async getSchema() {
    console.log("Schema generation :: start");

    const response = await fetch(this.config.url);
    const data = await response.json();

    if (!data.items) throw new Error(data.message || "Unknown error");

    const customContentTypes = data.items
      .map(this.transformContentTypeToGQL.bind(this))
      .join("\n\n");

    if (this.config.updateObjectTypes) {
      console.log("Schema generation :: updating object types");
      this.addMissingObjectTypesDefinitions();
      console.log("Schema generation :: object types updated");
    }

    const finalSchema = [
      this.getBuiltinTypes(),
      this.getCustomTypes(),
      this.collectedUnions.join("\n\n"),
      this.textFields.join("\n\n"),
      customContentTypes,
    ]
      .map((x) => x.trim())
      .join("\n\n");

    if (this.config.generatedDir) {
      if (!fs.existsSync(this.config.generatedDir)) {
        fs.mkdirSync(this.config.generatedDir, 0o744);
      }

      fs.writeFileSync(
        path.join(this.config.generatedDir, "contentful-schema.json"),
        JSON.stringify(data, null, 2)
      );

      const outFilePath = path.join(this.config.generatedDir, "schema.gql");
      fs.writeFileSync(outFilePath, finalSchema);
      console.log(
        `Schema generation :: saved schema in "${path.resolve(this.config.generatedDir)}"`
      );
    }

    console.log("Schema generation :: end");
    return finalSchema;
  }

  private transformContentTypeToGQL(contentTypeConfig: ContentTypeConfig) {
    const gqlContentTypeName = toGQLContentTypeName(contentTypeConfig.sys.id);
    return [
      this.config.isVerbose && toGQLContentTypeHeader(contentTypeConfig),
      `type ${gqlContentTypeName} implements Node {${[
        getNodeFields(gqlContentTypeName),
        this.transformContentTypeFieldsToGQL(contentTypeConfig).join(""),
      ].join("")}\n}`,
      getSysTypes(gqlContentTypeName),
    ]
      .filter(Boolean)
      .join("\n");
  }

  private transformContentTypeFieldsToGQL(contentTypeConfig: ContentTypeConfig) {
    return contentTypeConfig.fields.flatMap((fieldConfig) => {
      const fieldDefs = this.getGQLFieldTypeDefs(fieldConfig, contentTypeConfig);

      return fieldDefs.map((fieldDef) => {
        let type = fieldDef.fieldBasicType;
        if (fieldDef.isArray) type = `[${type}]`;
        // if (fieldDef.isRequired) type = `${type}!`; // voluntarily omitted
        if (fieldDef.generatedDirectives) type = [type, fieldDef.generatedDirectives].join(" ");

        return [
          this.config.isVerbose && fieldDef.fieldHeader && `\n\t# ${fieldDef.fieldHeader}`,
          fieldDef.fieldBasicType && `\n\t${fieldDef.fieldName}: ${type}`,
        ]
          .filter(Boolean)
          .join("");
      });
    });
  }

  /**
   * See https://www.contentful.com/developers/docs/concepts/data-model/
   */
  private getGQLFieldTypeDefs(
    fieldConfig: FieldConfig,
    contentTypeConfig?: ContentTypeConfig
  ): FieldDefinitionObject[] {
    const fieldType = fieldConfig.type;
    const baseFields: Omit<FieldDefinitionObject, "fieldBasicType"> = {
      fieldName: fieldConfig.id,
    };
    if ("required" in fieldConfig && fieldConfig.required) {
      baseFields.isRequired = true;
    }
    if ("name" in fieldConfig && fieldConfig.name) {
      baseFields.fieldHeader = fieldConfig.name;
    }

    switch (fieldType) {
      case "Boolean":
      case "RichText":
        return [{ ...baseFields, fieldBasicType: fieldType }];
      case "Symbol":
      case "Date":
        return [{ ...baseFields, fieldBasicType: "String" }];
      case "Text":
        return [
          {
            ...baseFields,
            ...this.getLongTextType(fieldConfig, contentTypeConfig!),
          },
        ];
      case "Object":
        // we just register the type to update custom-types.gql...
        if (contentTypeConfig) {
          this.retrievedObjectFields.push({ fieldConfig, contentTypeConfig });
        }
        // ...and let automatic inference do its job (no fields explicitly added to schema)
        return [];
      case "Integer":
        return [{ ...baseFields, fieldBasicType: "Int" }];
      case "Number":
        return [{ ...baseFields, fieldBasicType: "Float" }];
      case "Link":
        return [{ ...baseFields, ...this.getFieldLinkType(fieldConfig) }];
      case "Array":
        return [{ ...baseFields, ...this.getArrayFieldType(fieldConfig, contentTypeConfig) }];
      default:
        return [{ ...baseFields, fieldBasicType: toGQLContentTypeName(fieldType) }];
    }
  }

  private getLongTextType(
    fieldConfig: FieldConfig,
    contentTypeConfig: ContentTypeConfig
  ): Partial<FieldDefinitionObject> & Pick<FieldDefinitionObject, "fieldBasicType"> {
    const contentTypeName = firstLetterToLowerCase(toGQLContentTypeName(contentTypeConfig.sys.id));
    const fieldName = capitalized(fieldConfig.id);
    const name = `${contentTypeName}${fieldName}TextNode`;
    this.textFields.push(`type ${name} implements Node {\n\t${fieldConfig.id}: String\n}`);
    return { fieldBasicType: name, generatedDirectives: `@link(from: "${fieldConfig.id}___NODE")` };
  }

  private getObjectTypeName(fieldId: string, contentTypeId: string) {
    const contentTypeName = firstLetterToLowerCase(toGQLContentTypeName(contentTypeId));
    return `${contentTypeName}${capitalized(fieldId)}JsonNode`;
  }

  addMissingObjectTypesDefinitions() {
    const customTypes = this.getCustomTypes();
    let typesToAdd = "";

    // add new entries
    this.retrievedObjectFields.forEach(({ fieldConfig, contentTypeConfig }) => {
      const contentTypeId = contentTypeConfig.sys.id;
      const name = this.getObjectTypeName(fieldConfig.id, contentTypeId);
      // check into custom types (gql) file;
      const typeDef = `type ${name} implements Node {`;
      if (!customTypes.includes(typeDef)) {
        typesToAdd += `${typeDef}\n\tfakeFieldForSchemaDefinition: Boolean # TODO: edit this\n}\n\n`;
      }
    });

    const customTypesPath = this.getCustomTypesPath();
    fs.writeFileSync(customTypesPath, customTypes.concat(typesToAdd));
  }

  private getFieldLinkType(
    fieldConfig: FieldConfig
  ): Partial<FieldDefinitionObject> & Pick<FieldDefinitionObject, "fieldBasicType"> {
    const commonFields: Partial<FieldDefinitionObject> = {
      generatedDirectives: `@link(from: "${fieldConfig.id}___NODE")`,
    };

    if ("validations" in fieldConfig && fieldConfig.validations) {
      const linkContentTypeItem = fieldConfig.validations.find(
        ({ linkContentType }) => linkContentType
      );
      if (linkContentTypeItem && linkContentTypeItem.linkContentType) {
        if (linkContentTypeItem.linkContentType.length === 1) {
          // Only 1 possibility: no need for a dedicated union type
          return {
            fieldBasicType: toGQLContentTypeName(linkContentTypeItem.linkContentType[0]),
            ...commonFields,
          };
        } else {
          // Create a new union type
          const unionTypes = linkContentTypeItem.linkContentType.map(toGQLContentTypeName);
          const unionName = `Union__${unionTypes.join("__")}`;
          this.collectedUnions.push(`union ${unionName} = ${unionTypes.join(" | ")}`);
          return {
            fieldBasicType: unionName,
            ...commonFields,
          };
        }
      }
    }

    return {
      ...this.getGQLFieldTypeDefs({
        id: fieldConfig.id,
        type: (fieldConfig as FieldItemsType).linkType,
      })[0],
      ...commonFields,
    };
  }

  private getArrayFieldType(
    fieldConfig: FieldConfig,
    contentTypeConfig?: ContentTypeConfig
  ): Partial<FieldDefinitionObject> & Pick<FieldDefinitionObject, "fieldBasicType"> {
    return {
      ...this.getGQLFieldTypeDefs(
        {
          id: fieldConfig.id,
          type: fieldConfig.type,
          ...(fieldConfig as BaseFieldType).items!,
        },
        contentTypeConfig
      )[0],
      isArray: true,
    };
  }

  /**
   * Returns Contentful types that must be added to the schema definitions,
   * otherwise createTypes will throw an error.
   */
  private getBuiltinTypes() {
    const builtinTypesPath = this.getBuiltinTypesPath();
    const builtInTypes = fs.readFileSync(builtinTypesPath).toString();
    return builtInTypes;
  }

  /**
   * Returns Custom types that are manually edited, i.e. Object types
   */
  private getCustomTypes() {
    const customTypesPath = this.getCustomTypesPath();
    const customTypes = fs.readFileSync(customTypesPath).toString();
    return customTypes;
  }
}
