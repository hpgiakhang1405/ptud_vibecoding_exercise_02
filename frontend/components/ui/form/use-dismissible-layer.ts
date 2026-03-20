"use client";

import { useEffect, type RefObject } from "react";

type UseDismissibleLayerOptions = {
  open: boolean;
  refs: Array<RefObject<HTMLElement | null>>;
  onDismiss: () => void;
};

export function useDismissibleLayer({
  open,
  refs,
  onDismiss,
}: UseDismissibleLayerOptions) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const isInside = refs.some((ref) => ref.current?.contains(target));

      if (!isInside) {
        onDismiss();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onDismiss, open, refs]);
}
