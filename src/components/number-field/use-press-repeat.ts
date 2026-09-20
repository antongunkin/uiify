"use client";

import { useCallback, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useInterval, useTimeout } from "@gunkin/uiify/hooks";

const INITIAL_DELAY_MS = 400;

const REPEAT_INTERVAL_MS = 80;

export function usePressRepeat(onRepeat: () => void, disabled: boolean) {
  const [holding, setHolding] = useState(false);
  const [repeating, setRepeating] = useState(false);

  useTimeout(() => setRepeating(true), holding && !repeating ? INITIAL_DELAY_MS : null);
  useInterval(onRepeat, holding && repeating ? REPEAT_INTERVAL_MS : null);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (disabled || event.button !== 0) return;
      event.preventDefault();
      onRepeat();
      setHolding(true);
    },
    [disabled, onRepeat],
  );

  const stop = useCallback(() => {
    setHolding(false);
    setRepeating(false);
  }, []);

  return {
    onPointerDown,
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
  };
}
