import { RefObject, useEffect, useRef } from "react";

import { useIsInViewport } from "./useIsInViewport";

export function useOnCarouselItemVisible(
  activeItemIndex: number,
  container: RefObject<Element>,
  onVisible: () => void
) {
  const isProductCarouselVisible = useIsInViewport(container) && !document.hidden;
  const trackedItems = useRef<number[]>([]);

  useEffect(() => {
    if (isProductCarouselVisible && !trackedItems.current.includes(activeItemIndex)) {
      trackedItems.current.push(activeItemIndex);
      onVisible();
    }
  }, [isProductCarouselVisible, activeItemIndex, onVisible]);
}
