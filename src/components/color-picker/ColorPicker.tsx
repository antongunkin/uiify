"use client";

import { useId, useRef, useState, type CSSProperties, type ReactElement } from "react";
import { useEventCallback, useMergedRefs } from "@gunkin/uiify/hooks";
import { cn } from "../../core/class-names.js";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { mergeRepeatedSlotProps } from "../../core/slot-props.js";
import type { SlotProps } from "../../core/slot-props.js";
import { Field, FieldLabel } from "../field/index.js";
import type { ColorPickerProps } from "./types.js";

export function ColorPicker(props: ColorPickerProps): ReactElement {
  const {
    alpha = false,
    className,
    colorSpace,
    defaultValue = "#2563eb",
    disabled = false,
    id,
    label,
    onChange,
    onValueChange,
    ref,
    slotProps,
    style,
    value,
    ...nativeProps
  } = props;
  const ariaLabel = props["aria-label"];
  const ariaInvalid = props["aria-invalid"];
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const nativeInputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = value ?? uncontrolledValue;
  const rootDataProps: Record<string, unknown> = {};
  const nativeInputProps: Record<string, unknown> = {};

  for (const [name, propValue] of Object.entries(nativeProps)) {
    if (name.startsWith("data-")) rootDataProps[name] = propValue;
    else nativeInputProps[name] = propValue;
  }

  const fieldProps = mergeRepeatedSlotProps<SlotProps<"div">>(
    { ...rootDataProps, className, style },
    slotProps?.field,
  );
  const labelProps = slotProps?.label;
  const surfaceProps = slotProps?.surface;
  const controlProps = slotProps?.control;
  const inputProps = mergeRepeatedSlotProps<SlotProps<"input">>(
    { ...nativeInputProps, onChange },
    slotProps?.input,
  );
  const mergedInputRef = useMergedRefs(ref, inputProps.ref, nativeInputRef);

  const controlStyle = {
    "--uiify-color-picker-value": selectedValue,
  } as CSSProperties;
  const invalid =
    (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false") ||
    rootDataProps["data-invalid"] === true ||
    rootDataProps["data-invalid"] === "" ||
    rootDataProps["data-invalid"] === "true";
  const required = Boolean(nativeInputProps.required);
  const openNativePicker = useEventCallback((event: { preventDefault: () => void }) => {
    event.preventDefault();
    nativeInputRef.current?.click();
  });

  return (
    <Field
      data-disabled={disabled ? "" : undefined}
      data-required={required ? "" : undefined}
      invalid={invalid}
      {...fieldProps}
      className={cn("uiify-color-picker", fieldProps.className)}
    >
      <FieldLabel
        disabled={disabled}
        htmlFor={inputId}
        id={labelId}
        required={required}
        {...labelProps}
        className={cn("uiify-color-picker-label", labelProps?.className)}
        onClick={composeEventHandlers(labelProps?.onClick, openNativePicker)}
      >
        {label}
      </FieldLabel>
      <div
        data-value={selectedValue}
        {...surfaceProps}
        className={cn("uiify-color-picker-surface", surfaceProps?.className)}
        style={{ ...controlStyle, ...surfaceProps?.style }}
      >
        <input
          aria-hidden="true"
          aria-invalid={invalid || undefined}
          data-disabled={disabled ? "" : undefined}
          data-invalid={invalid ? "" : undefined}
          data-required={required ? "" : undefined}
          disabled={disabled || undefined}
          readOnly
          required={required || undefined}
          tabIndex={-1}
          type="text"
          value={selectedValue}
          {...controlProps}
          className={cn("uiify-input uiify-color-picker-control", controlProps?.className)}
        />
        <input
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabel ? undefined : labelId}
          disabled={disabled}
          id={inputId}
          type="color"
          value={selectedValue}
          required={required || undefined}
          {...(alpha ? { alpha: "" } : {})}
          {...(colorSpace ? { colorspace: colorSpace } : {})}
          {...inputProps}
          className={cn("uiify-color-picker-native-input", inputProps.className)}
          ref={mergedInputRef}
          onChange={composeEventHandlers(inputProps.onChange, (event) => {
            const nextValue = event.currentTarget.value;
            if (value === undefined) setUncontrolledValue(nextValue);
            onValueChange?.(nextValue);
          })}
        />
      </div>
    </Field>
  );
}
ColorPicker.displayName = "ColorPicker";
