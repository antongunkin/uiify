"use client";

import type {
  CSSProperties,
  ElementType,
  KeyboardEvent,
  ReactElement,
  SyntheticEvent,
} from "react";
import { useSyncExternalStore } from "react";
import { useControllableState } from "@gunkin/uiify/hooks";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { resolveDirection } from "@gunkin/uiify/core/text-direction";
import { cn } from "../../../core/class-names.js";
import { mergeRepeatedSlotProps, resolveRepeatedSlotProps } from "../../../core/slot-props.js";

import { getSliderStops, snapSliderToStops } from "../slider-values.js";
import type {
  SliderClientProps,
  SliderClientSlotProps,
  SliderClientValue,
  SliderMark,
} from "../types.js";

const subscribeToNothing = () => () => {};
const isClient = () => true;
const isServer = () => false;

const DEFAULT_SLIDER_LABELS = {
  minimum: "Minimum value",
  maximum: "Maximum value",
} as const;

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

function applyValueGap(
  value: SliderClientValue,
  min: number,
  max: number,
  gap: number,
): SliderClientValue {
  if (typeof value === "number" || gap <= 0) return value;

  let [lower, upper] = value;
  if (upper - lower >= gap) return value;

  lower = Math.max(min, upper - gap);
  if (upper - lower < gap) upper = Math.min(max, lower + gap);
  return [lower, upper];
}

function normalizeSelection(
  value: SliderClientValue,
  min: number,
  max: number,
  step: number | null,
  stops: readonly number[],
  gap: number,
): SliderClientValue {
  const normalized = normalizeValue(value, min, max);
  const safeGap = Math.min(gap, max - min);
  if (step !== null) return applyValueGap(normalized, min, max, safeGap);
  if (typeof normalized === "number") return snapSliderToStops(normalized, stops);

  const lowerStops = stops.filter((stop) => stop <= normalized[1] - safeGap);
  const lower = snapSliderToStops(normalized[0], lowerStops.length > 0 ? lowerStops : [stops[0]!]);
  const upperStops = stops.filter((stop) => stop >= lower + safeGap);
  return [
    lower,
    snapSliderToStops(
      normalized[1],
      upperStops.length > 0 ? upperStops : [stops[stops.length - 1]!],
    ),
  ];
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

function resolveMarkSlotProps(
  slotProps: SliderClientSlotProps["mark"],
  markValue: number,
  index: number,
) {
  const { byItemValue, byItemIndex, ...commonProps } = slotProps ?? {};
  return mergeRepeatedSlotProps(
    mergeRepeatedSlotProps(commonProps, byItemValue?.[String(markValue)]),
    byItemIndex?.[index],
  );
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
    minStepsBetweenValues = 0,
    disabled = false,
    orientation = "horizontal",
    marks = [],
    labels,
    slotProps,
    thumbLabels,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...consumerProps
  } = props as SliderClientProps<"div">;

  const stops = getSliderStops(min, max, marks);
  const gap = Math.min(Math.max(0, minStepsBetweenValues), Math.max(0, max - min));
  const initialValue = normalizeSelection(defaultValue ?? min, min, max, step, stops, gap);
  const safeControlledValue =
    controlledValue === undefined
      ? undefined
      : normalizeSelection(controlledValue, min, max, step, stops, gap);
  const [value, setValue] = useControllableState<SliderClientValue>({
    defaultValue: initialValue,
    onChange: onValueChange,
    value: safeControlledValue,
  });
  // False for SSR and the hydration render, so both markups match; true once the client owns it.
  const enhanced = useSyncExternalStore(subscribeToNothing, isClient, isServer);

  const normalizedValue = normalizeValue(value, min, max);
  const values: readonly number[] =
    typeof normalizedValue === "number"
      ? [normalizedValue]
      : [normalizedValue[0], normalizedValue[1]];
  const isRange = values.length === 2;
  const consumerStyle = "style" in consumerProps ? consumerProps.style : undefined;
  const positionStyles: readonly SliderPositionStyle[] = values.map((currentValue) => ({
    "--uiify-slider-position": String(position(currentValue, min, max)) + "%",
  }));
  const rootStyle: SliderPositionStyle = {
    "--uiify-slider-start": String(position(values[0]!, min, max)) + "%",
    "--uiify-slider-end": String(position(values[values.length - 1]!, min, max)) + "%",
    "--uiify-slider-middle":
      String(
        (position(values[0]!, min, max) + position(values[values.length - 1]!, min, max)) / 2,
      ) + "%",
    ...consumerStyle,
  };
  const visibleMarks = marksInRange(marks, min, max);
  const accessibleLabels = { ...DEFAULT_SLIDER_LABELS, ...labels };

  const setThumbValue = (index: number, proposed: number): void => {
    if (disabled) return;

    if (!isRange) {
      const next = step === null ? snapSliderToStops(proposed, stops) : proposed;
      setValue(next);
      return;
    }

    const lower = index === 0 ? min : values[0]! + gap;
    const upper = index === 0 ? values[1]! - gap : max;
    const availableStops = stops.filter((stop) => stop >= lower && stop <= upper);
    const snapped = step === null ? snapSliderToStops(proposed, availableStops) : proposed;
    const nextValue =
      index === 0
        ? ([Math.min(snapped, upper), values[1]!] as const)
        : ([values[0]!, Math.max(snapped, lower)] as const);
    setValue(nextValue);
  };

  const handleChange = (index: number, event: SyntheticEvent<HTMLInputElement>): void => {
    setThumbValue(index, event.currentTarget.valueAsNumber);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>): void => {
    if (disabled || step !== null) return;

    const horizontalKey = event.key === "ArrowRight" || event.key === "ArrowLeft";
    const mirror =
      horizontalKey && orientation !== "vertical" && resolveDirection(event.currentTarget) === "rtl"
        ? -1
        : 1;
    const direction =
      (event.key === "ArrowRight" || event.key === "ArrowUp"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : 0) * mirror;
    if (direction === 0) return;

    event.preventDefault();
    const currentValue = values[index]!;
    const availableStops = isRange
      ? stops.filter((stop) => (index === 0 ? stop <= values[1]! - gap : stop >= values[0]! + gap))
      : stops;
    const currentIndex = availableStops.indexOf(currentValue);
    const nextValue = availableStops[currentIndex + direction];
    if (currentIndex !== -1 && nextValue !== undefined) setThumbValue(index, nextValue);
  };

  const thumbKeys = isRange ? (["minimum", "maximum"] as const) : (["value"] as const);
  const inputNodes = values.map((currentValue, index) => {
    const thumbKey = thumbKeys[index]!;
    const inputProps = resolveRepeatedSlotProps(slotProps?.input, thumbKey);
    const inputLabel = isRange
      ? (thumbLabels?.[index] ??
        (index === 0 ? accessibleLabels.minimum : accessibleLabels.maximum))
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
        data-state={String(currentValue)}
        data-orientation={orientation}
        data-disabled={disabled ? "" : undefined}
        {...inputProps}
        className={cn("uiify-slider-client-thumb uiify-slider-thumb", inputProps.className)}
        onChange={composeEventHandlers(inputProps.onChange, (event) => handleChange(index, event))}
        onKeyDown={composeEventHandlers(inputProps.onKeyDown, (event) =>
          handleKeyDown(index, event),
        )}
      />
    );
  });

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      role: isRange ? "group" : undefined,
      "aria-label": isRange ? ariaLabel : undefined,
      "aria-labelledby": isRange ? ariaLabelledBy : undefined,
      "data-range": isRange ? "" : undefined,
      "data-state": isRange ? "range" : String(values[0]),
      "data-orientation": orientation,
      "data-disabled": disabled ? "" : undefined,
      "data-enhanced": enhanced ? "" : undefined,
      ...consumerProps,
      className: cn("uiify-slider-client", className),
      style: rootStyle,
      children: (
        <>
          <div
            aria-hidden="true"
            {...slotProps?.track}
            className={cn(
              "uiify-slider-client-track uiify-slider-track",
              slotProps?.track?.className,
            )}
          >
            <span
              {...slotProps?.range}
              className={cn(
                "uiify-slider-client-range uiify-slider-range",
                slotProps?.range?.className,
              )}
            />
            {visibleMarks.map((mark, index) => {
              const markProps = resolveMarkSlotProps(slotProps?.mark, mark.value, index);
              return (
                <span
                  key={index}
                  {...markProps}
                  className={cn("uiify-slider-client-mark uiify-slider-mark", markProps.className)}
                  style={
                    {
                      "--uiify-slider-position": String(position(mark.value, min, max)) + "%",
                      ...markProps.style,
                    } as SliderPositionStyle
                  }
                >
                  {mark.label}
                </span>
              );
            })}
            {positionStyles.map((style, index) => {
              const thumbProps = resolveRepeatedSlotProps(
                slotProps?.visualThumb,
                thumbKeys[index]!,
              );
              return (
                <span
                  key={index}
                  {...thumbProps}
                  className={cn(
                    "uiify-slider-client-visual-thumb uiify-slider-visual-thumb",
                    thumbProps.className,
                  )}
                  style={{ ...style, ...thumbProps.style }}
                />
              );
            })}
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
