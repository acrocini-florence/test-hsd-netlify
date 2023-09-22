import { RefObject, useEffect, useMemo, useState } from "react";

export function useIsInViewport(ref: RefObject<Element>) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(() => {
    if (typeof window !== "undefined") {
      return new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      });
    } else return null;
  }, []);

  useEffect(() => {
    if (ref.current) observer?.observe(ref.current);

    return () => {
      observer?.disconnect();
    };
  }, [ref, observer]);

  return isIntersecting;
}
