import { Variants } from "framer-motion";

export enum VariantsKeys {
  OPEN = "open",
  CLOSED = "closed",
}

export interface VariantsProps {
  mobileVariant: boolean;
  offset?: string;
  isSelected: boolean;
}

export const motionVariants: Variants = {
  [VariantsKeys.OPEN]: ({ mobileVariant, offset, isSelected }: VariantsProps) => ({
    opacity: 1,
    x: mobileVariant ? (isSelected ? "0px" : "30px") : offset || "0px",
    transition: {
      ease: "easeOut",
      opacity: {
        duration: 0,
      },
      x: {
        delay: 0.01,
        duration: 0.25,
      },
    },
  }),
  [VariantsKeys.CLOSED]: ({ mobileVariant, offset }: VariantsProps) => ({
    opacity: 0,
    x: mobileVariant ? "100vw" : offset ? `calc(${offset} - 30vw)` : "-30vw",
    transition: {
      ease: "easeOut",
      opacity: {
        duration: mobileVariant ? 0 : 0.25,
        delay: !mobileVariant ? 0 : 0.3,
      },
      x: {
        delay: mobileVariant ? 0 : 0.3,
        duration: mobileVariant ? 0.25 : 0.1,
      },
    },
  }),
};
