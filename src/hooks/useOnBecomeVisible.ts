import { RefObject, useEffect, useRef } from "react";

import { useIsInViewport } from "./useIsInViewport";

export function useOnBecomeVisible(container: RefObject<Element>, onVisible: () => void) {
  const isProductCarouselVisible = useIsInViewport(container) && !document.hidden;
  const wasAlreadySeen = useRef(false);

  useEffect(() => {
    if (isProductCarouselVisible && !wasAlreadySeen.current) {
      wasAlreadySeen.current = true;
      onVisible();
    }
  }, [isProductCarouselVisible, onVisible]);
}
