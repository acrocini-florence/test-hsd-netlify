export type FormConsents = {
  privacy?: boolean;
  marketing?: boolean;
  communication?: boolean;
};

export type FormConsentsKeys = keyof FormConsents;

export enum FormMaterials {
  GLASS_STONE = "glassAndStone",
  ALUMINIUM = "aluminium",
  METAL = "metal",
  OTHER = "other",
  PLASTIC_COMPOSITE = "plasticAndComposite",
  WOOD = "wood",
}

export type FormPayload = {
  firstName?: string;
  lastName?: string;
  city?: string;
  company?: string;
  country?: string;
  email?: string;
  leadSource?: string;
  mobile?: string;
  phone?: string;
  requestMessage?: string;
  requestTitle?: string;
  materials?: FormMaterials[];
  consents?: FormConsents;
};
