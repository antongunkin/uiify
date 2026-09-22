import type { ElementType, ReactElement, SyntheticEvent } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { SliderProps } from "./types.js";

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

  const handleChange = (event: SyntheticEvent<HTMLInputElement>): void => {
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
      ...consumerProps,
      type: "range",
      "data-uiify-slider": "",
      min,
      max,
      step,
      disabled: disabled || undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-state": isControlled ? String(value) : undefined,
      onChange: composeEventHandlers(consumerOnChange, handleChange),
      ...(isControlled ? { value } : defaultValue !== undefined ? { defaultValue } : {}),
    },
    render,
    state: { min, max, step, disabled },
  });
}
