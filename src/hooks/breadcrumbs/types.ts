import { BreadcrumbItemData as BiesseBreadcrumbItemData } from "@biesse-group/react-components";

/**
 * I added originalLabel here as biesse-ui shouldn't know about it, as it performs no trackings
 */
export interface BreadcrumbItemData extends BiesseBreadcrumbItemData {
  originalLabel: string | null;
}
