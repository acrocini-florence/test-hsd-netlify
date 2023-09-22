import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";

export function isEmailValid(email: string) {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
}

export function isMobileValid(mobile: string) {
  return /^(\+)?([\d\s-])+$/g.test(mobile || "");
}

export function useDebouncedStringValidation(
  value?: string,
  validationFn?: (v: string) => boolean,
  debounceAmount = 750
) {
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);

  const debouncedSetValid = useRef(
    debounce((value?: string) => {
      setIsValid(value ? validationFn?.(value) : undefined);
    }, debounceAmount)
  );

  useEffect(() => {
    debouncedSetValid.current(value);
  }, [value]);

  return isValid;
}
