"use client";

import type {
  CSSProperties,
  ElementType,
  KeyboardEvent,
  ReactElement,
  SyntheticEvent,
} from "react";
import { useEffect, useState } from "react";
import { useControllableState } from "@gunkin/uiify/hooks";
import { useRenderElement } from "@gunkin/uiify/core/render";

import { getSliderStops, snapSliderToStops } from "../slider-values.js";
import type { SliderClientProps, SliderClientValue, SliderMark } from "../types.js";

type SliderPositionStyle = CSSProperties & {
  readonly "--uiify-slider-position"?: string;
  readonly "--uiify-slider-start"?: string;
  readonly "--uiify-slider-end"?: string;
  readonly "--uiify-slider-middle"?: string;
};

function normalizeValue(value: SliderClientValue, min: number, max: number): SliderClientValue {
  if (typeof value === "number") return Math.max(min, Math.min(max, value));

  const first = Math.max(min, Math.min(max, value[0]));
  const second = Math.max(min, Math.min(max, value[1]));
  return first <= second ? [first, second] : [second, first];
}

function normalizeSelection(
  value: SliderClientValue,
  min: number,
  max: number,
  step: number | null,
  stops: readonly number[],
): SliderClientValue {
  const normalized = normalizeValue(value, min, max);
  if (step !== null) return normalized;
  if (typeof normalized === "number") return snapSliderToStops(normalized, stops);

  const lowerStops = stops.filter((stop) => stop <= normalized[1]);
  const lower = snapSliderToStops(normalized[0], lowerStops);
  const upperStops = stops.filter((stop) => stop >= lower);
  return [lower, snapSliderToStops(normalized[1], upperStops)];
}

function position(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

function marksInRange(
  marks: readonly SliderMark[],
  min: number,
  max: number,
): readonly SliderMark[] {
  return marks.filter(({ value }) => Number.isFinite(value) && value >= min && value <= max);
}

export function SliderClient<TAs extends ElementType = "div">(
  props: SliderClientProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    value: controlledValue,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    orientation = "horizontal",
    marks = [],
    thumbLabels,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...consumerProps
  } = props as SliderClientProps<"div">;

  const stops = getSliderStops(min, max, marks);
  const initialValue = normalizeSelection(defaultValue ?? min, min, max, step, stops);
  const safeControlledValue =
    controlledValue === undefined
      ? undefined
      : normalizeSelection(controlledValue, min, max, step, stops);
  const [value, setValue] = useControllableState<SliderClientValue>({
    defaultValue: initialValue,
    onChange: onValueChange,
    value: safeControlledValue,
  });
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);

  const normalizedValue = normalizeValue(value, min, max);
  const values: readonly number[] =
    typeof normalizedValue === "number"
      ? [normalizedValue]
      : [normalizedValue[0], normalizedValue[1]];
  const isRange = values.length === 2;
  const consumerStyle = "style" in consumerProps ? consumerProps.style : undefined;
  const consumerRole = "role" in consumerProps ? consumerProps.role : undefined;
  const positionStyles: readonly SliderPositionStyle[] = values.map((currentValue) => ({
    "--uiify-slider-position": String(position(currentValue, min, max)) + "%",
  }));
  const rootStyle: SliderPositionStyle = {
    ...consumerStyle,
    "--uiify-slider-start": String(position(values[0]!, min, max)) + "%",
    "--uiify-slider-end": String(position(values[values.length - 1]!, min, max)) + "%",
    "--uiify-slider-middle":
      String(
        (position(values[0]!, min, max) + position(values[values.length - 1]!, min, max)) / 2,
      ) + "%",
  };
  const visibleMarks = marksInRange(marks, min, max);

  const setThumbValue = (index: number, proposed: number): void => {
    if (disabled) return;

    if (!isRange) {
      const next = step === null ? snapSliderToStops(proposed, stops) : proposed;
      setValue(next);
      return;
    }

    const lower = index === 0 ? min : values[0]!;
    const upper = index === 0 ? values[1]! : max;
    const availableStops = stops.filter((stop) => stop >= lower && stop <= upper);
    const snapped = step === null ? snapSliderToStops(proposed, availableStops) : proposed;
    const nextValue =
      index === 0
        ? ([Math.min(snapped, values[1]!), values[1]!] as const)
        : ([values[0]!, Math.max(snapped, values[0]!)] as const);
    setValue(nextValue);
  };

  const handleChange = (index: number, event: SyntheticEvent<HTMLInputElement>): void => {
    setThumbValue(index, event.currentTarget.valueAsNumber);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>): void => {
    if (disabled || step !== null) return;

    const direction =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : 0;
    if (direction === 0) return;

    event.preventDefault();
    const currentValue = values[index]!;
    const availableStops = isRange
      ? stops.filter((stop) => (index === 0 ? stop <= values[1]! : stop >= values[0]!))
      : stops;
    const currentIndex = availableStops.indexOf(currentValue);
    const nextValue = availableStops[currentIndex + direction];
    if (nextValue !== undefined) setThumbValue(index, nextValue);
  };

  const inputNodes = values.map((currentValue, index) => {
    const inputLabel = isRange
      ? (thumbLabels?.[index] ?? (index === 0 ? "Minimum value" : "Maximum value"))
      : ariaLabel;
    const inputLabelledBy = isRange ? undefined : ariaLabelledBy;

    return (
      <input
        key={index}
        type="range"
        min={min}
        max={max}
        step={step === null ? "any" : step}
        value={currentValue}
        disabled={disabled}
        aria-label={inputLabel}
        aria-labelledby={inputLabelledBy}
        aria-orientation={orientation}
        data-part="thumb"
        data-state={String(currentValue)}
        data-orientation={orientation}
        data-disabled={disabled ? "" : undefined}
        onChange={(event) => handleChange(index, event)}
        onKeyDown={(event) => handleKeyDown(index, event)}
      />
    );
  });

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      role: isRange ? "group" : consumerRole,
      "aria-label": isRange ? ariaLabel : undefined,
      "aria-labelledby": isRange ? ariaLabelledBy : undefined,
      "data-uiify-slider-client": "",
      "data-part": "root",
      "data-range": isRange ? "" : undefined,
      "data-state": isRange ? "range" : String(values[0]),
      "data-orientation": orientation,
      "data-disabled": disabled ? "" : undefined,
      "data-enhanced": enhanced ? "" : undefined,
      style: rootStyle,
      children: (
        <>
          <div data-part="track" aria-hidden="true">
            <span data-part="range" />
            {visibleMarks.map((mark) => (
              <span
                key={mark.value}
                data-part="mark"
                style={
                  {
                    "--uiify-slider-position": String(position(mark.value, min, max)) + "%",
                  } as SliderPositionStyle
                }
              >
                {mark.label}
              </span>
            ))}
            {positionStyles.map((style, index) => (
              <span key={index} data-part="visual-thumb" style={style} />
            ))}
          </div>
          {inputNodes}
        </>
      ),
    },
    render,
    state: { disabled, orientation, value: normalizedValue },
  });
}

SliderClient.displayName = "SliderClient";
