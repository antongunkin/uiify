"use client";

import { useCallback, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export interface UseHoverResult {
  isHovered: boolean;
  hoverProps: {
    onPointerEnter: (event: ReactPointerEvent) => void;
    onPointerLeave: (event: ReactPointerEvent) => void;
  };
}

/** Pointer-based hover state. Returns spreadable props. */
export function useHover(): UseHoverResult {
  const [isHovered, setIsHovered] = useState(false);
  const onPointerEnter = useCallback((event: ReactPointerEvent) => {
    if (event.pointerType !== "touch") setIsHovered(true);
  }, []);
  const onPointerLeave = useCallback((event: ReactPointerEvent) => {
    if (event.pointerType !== "touch") setIsHovered(false);
  }, []);
  const hoverProps = useMemo(
    () => ({ onPointerEnter, onPointerLeave }),
    [onPointerEnter, onPointerLeave],
  );
  return { isHovered, hoverProps };
}
