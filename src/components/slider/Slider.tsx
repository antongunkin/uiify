import type { CSSProperties, ElementType, ReactElement, SyntheticEvent } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { SliderProps } from "./types.js";

function getProgressPercentage(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Number(Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)).toFixed(4));
}

export function Slider<TAs extends ElementType = "input">(
  props: SliderProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    value,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    ...consumerProps
  } = props as SliderProps<"input">;

  const isControlled = value !== undefined;
  const progressValue = value ?? defaultValue ?? min + (max - min) / 2;
  const progress = getProgressPercentage(progressValue, min, max);
  const consumerStyle = (consumerProps as { style?: CSSProperties }).style;
  const style = {
    "--uiify-slider-progress": `${progress}%`,
    ...consumerStyle,
  } as CSSProperties;

  const handleChange = (event: SyntheticEvent<HTMLInputElement>): void => {
    if (!isControlled) {
      const nextProgress = getProgressPercentage(event.currentTarget.valueAsNumber, min, max);
      const nextStyle = { "--uiify-slider-progress": `${nextProgress}%`, ...consumerStyle };
      const nextValue = nextStyle["--uiify-slider-progress"];
      if (nextValue === undefined)
        event.currentTarget.style.removeProperty("--uiify-slider-progress");
      else event.currentTarget.style.setProperty("--uiify-slider-progress", nextValue);
    }
    onValueChange?.(event.currentTarget.valueAsNumber);
  };

  const consumerOnChange = (
    consumerProps as Record<string, unknown> & {
      onChange?: (event: SyntheticEvent<HTMLInputElement>) => void;
    }
  ).onChange;

  return useRenderElement({
    as,
    defaultTag: "input",
    props: {
      type: "range",
      "data-uiify-slider": "",
      min,
      max,
      step,
      disabled: disabled || undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-state": isControlled ? String(value) : undefined,
      ...(isControlled ? { value } : defaultValue !== undefined ? { defaultValue } : {}),
      ...consumerProps,
      style,
      onChange: composeEventHandlers(consumerOnChange, handleChange),
    },
    render,
    state: { min, max, step, disabled },
  });
}
