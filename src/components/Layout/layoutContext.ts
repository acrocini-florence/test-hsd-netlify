import { createContext, useContext } from "react";

interface LayoutContextData {
  language: string;
  defaultLanguage: string;
  currentPath: string;
}

export const defaultLayoutContextValue: LayoutContextData = {
  language: "en",
  defaultLanguage: "en",
  currentPath: "/",
};

export const LayoutContext = createContext(defaultLayoutContextValue);

export const useLayoutContext = () => useContext(LayoutContext);
