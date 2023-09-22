export const MAX_LEAD_MESSAGE_CHARACTERS = 300;

export enum InterestFieldType {
  MORE_INFO = "ask-for-more-info",
  ESTIMATE_PRICE = "ask-for-estimated-price",
  ASSISTANCE = "ask-for-assistance",
  MY_HSD_DEMO = "ask-for-hsd-demo",
  BECOME_PROVIDER = "become-a-provider",
  NEWSLETTER = "newsletter",
  EVENT_TICKET = "event-ticket",
  DOWNLOAD_CATALOG = "download-catalog",
}

export const formPayloadTitleMap: Record<InterestFieldType | "undefined", string> = {
  [InterestFieldType.MORE_INFO]: "Request information",
  [InterestFieldType.ESTIMATE_PRICE]: "Request a quote",
  [InterestFieldType.ASSISTANCE]: "Ask for assistance",
  [InterestFieldType.MY_HSD_DEMO]: "Request a myHSD demo",
  [InterestFieldType.BECOME_PROVIDER]: "Apply to be a supplier",
  [InterestFieldType.NEWSLETTER]: "Subscribe to newsletter",
  [InterestFieldType.EVENT_TICKET]: "Request an event ticket",
  [InterestFieldType.DOWNLOAD_CATALOG]: "Download Catalog",
  undefined: "",
};

export const INTERESTS_FIELD_ITEMS_COMPLETE_VERSION = [
  InterestFieldType.MORE_INFO,
  InterestFieldType.ESTIMATE_PRICE,
];

export const INTERESTS_FIELD_ITEMS_PARTIAL_VERSION = [
  InterestFieldType.MY_HSD_DEMO,
  InterestFieldType.BECOME_PROVIDER,
];

export const INTERESTS_FIELD_ITEMS_EVENT_VERSION = [
  InterestFieldType.EVENT_TICKET,
  InterestFieldType.NEWSLETTER,
];
