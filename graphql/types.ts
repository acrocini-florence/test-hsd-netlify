export interface FieldDefinitionObject {
  fieldHeader?: string;
  fieldName: string;
  fieldBasicType: string;
  generatedDirectives?: string;
  isRequired?: boolean;
  isArray?: boolean;
}

export interface CommonFieldConfigProps {
  id: string;
  type: string;
}

export interface BaseFieldType extends CommonFieldConfigProps {
  name: string;
  localized?: boolean;
  required?: boolean;
  disabled?: boolean;
  omitted?: boolean;
  items?: FieldItemsType;
}

export interface FieldItemsType {
  validations: Array<{ linkContentType?: string[] }>;
  linkType: string;
}

export type FieldConfig =
  | CommonFieldConfigProps
  | BaseFieldType
  | (FieldItemsType & CommonFieldConfigProps);

export interface ContentTypeConfig {
  sys: {
    id: string;
  };
  name: string;
  description: string;
  fields: FieldConfig[];
}
