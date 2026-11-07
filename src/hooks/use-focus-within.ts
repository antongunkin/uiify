"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { FocusEvent as ReactFocusEvent } from "react";
import { useEventCallback } from "./use-event-callback.js";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.js";

export interface UseFocusWithinProps {
  onFocusWithin?: (event: FocusEvent) => void;
  onBlurWithin?: (event: FocusEvent) => void;
}

export interface UseFocusWithinResult {
  isFocusWithin: boolean;
  focusWithinProps: {
    onFocus: (event: ReactFocusEvent) => void;
    onBlur: (event: ReactFocusEvent) => void;
  };
}

/** Tracks whether focus is within the element. Returns spreadable props. */
export function useFocusWithin(props: UseFocusWithinProps = {}): UseFocusWithinResult {
  const { onFocusWithin, onBlurWithin } = props;
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const stateRef = useRef(isFocusWithin);
  useIsomorphicLayoutEffect(() => {
    stateRef.current = isFocusWithin;
  });

  const emitFocusWithin = useEventCallback((event: FocusEvent) => {
    onFocusWithin?.(event);
  });
  const emitBlurWithin = useEventCallback((event: FocusEvent) => {
    onBlurWithin?.(event);
  });

  const onFocus = useCallback(
    (event: ReactFocusEvent) => {
      if (!stateRef.current) {
        stateRef.current = true;
        setIsFocusWithin(true);
        emitFocusWithin(event.nativeEvent);
      }
    },
    [emitFocusWithin],
  );

  const onBlur = useCallback(
    (event: ReactFocusEvent) => {
      if (stateRef.current && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
        stateRef.current = false;
        setIsFocusWithin(false);
        emitBlurWithin(event.nativeEvent);
      }
    },
    [emitBlurWithin],
  );

  const focusWithinProps = useMemo(() => ({ onFocus, onBlur }), [onFocus, onBlur]);

  return { isFocusWithin, focusWithinProps };
}
