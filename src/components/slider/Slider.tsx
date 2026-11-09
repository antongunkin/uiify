import type { ChangeEvent, CSSProperties, ElementType, ReactElement } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { cn } from "../../core/class-names.js";
import type { SliderProps } from "./types.js";

type ChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;

/**
 * A native range in a root that draws the track. The input paints the fill and thumb with CSS
 * over its own value, so the slider works before hydration and in Server Components.
 */
export function Slider<TAs extends ElementType = "input">(props: SliderProps<TAs>): ReactElement {
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
    className,
    style,
    slotProps,
    ...consumerProps
  } = props as SliderProps<"input"> & { readonly style?: CSSProperties };

  const isControlled = value !== undefined;
  const inputProps = slotProps?.input ?? {};
  // Order: top-level onChange, then slot onChange, then onValueChange. No handler at all stays
  // undefined, so a Server Component never passes a function prop.
  let onChange: ChangeHandler | undefined = onValueChange
    ? (event) => onValueChange(event.currentTarget.valueAsNumber)
    : undefined;
  const consumerOnChange = (consumerProps as { readonly onChange?: ChangeHandler }).onChange;
  for (const consumer of [inputProps.onChange, consumerOnChange]) {
    if (!consumer) continue;
    onChange = onChange ? composeEventHandlers(consumer, onChange) : consumer;
  }

  const input = useRenderElement({
    as,
    defaultTag: "input",
    props: {
      type: "range",
      min,
      max,
      step,
      disabled: disabled || undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-state": isControlled ? String(value) : undefined,
      ...(isControlled ? { value } : defaultValue !== undefined ? { defaultValue } : {}),
      ...consumerProps,
      ...inputProps,
      className: cn("uiify-slider-input", inputProps.className),
      onChange,
    },
    render,
    state: { min, max, step, disabled },
  });

  return (
    <div className={cn("uiify-slider", className)} style={style}>
      {input}
    </div>
  );
}

Slider.displayName = "Slider";
