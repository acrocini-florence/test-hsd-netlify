import { useEffect, useState } from "react";

export function useIsModalOpen(
  initialState: boolean
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [isOpen, setIsOpen] = useState(initialState);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isOpen]);

  return [isOpen, setIsOpen];
}
