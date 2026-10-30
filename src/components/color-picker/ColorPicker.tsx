"use client";

import { useId, useRef, useState, type CSSProperties, type ReactElement } from "react";
import { useMergedRefs } from "@gunkin/uiify/hooks";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { mergeRepeatedSlotProps } from "../../core/slot-props.js";
import type { SlotProps } from "../../core/slot-props.js";
import { Field } from "../field/index.js";
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
  const fieldId = `${inputId}-field`;
  const nativeInputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = value ?? uncontrolledValue;
  const rootDataProps: Record<string, unknown> = {};
  const nativeInputProps: Record<string, unknown> = {};

  for (const [name, propValue] of Object.entries(nativeProps)) {
    if (name.startsWith("data-")) rootDataProps[name] = propValue;
    else nativeInputProps[name] = propValue;
  }

  const fieldProps = mergeRepeatedSlotProps<Omit<SlotProps<"div">, "id">>(
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

  return (
    <Field.Root
      data-uiify-color-picker=""
      disabled={disabled}
      id={fieldId}
      invalid={invalid}
      required={required}
      {...fieldProps}
    >
      <Field.Label
        disabled={disabled}
        fieldId={fieldId}
        required={required}
        {...labelProps}
        onClick={composeEventHandlers(labelProps?.onClick, (event) => {
          event.preventDefault();
          nativeInputRef.current?.click();
        })}
      >
        {label}
      </Field.Label>
      <div
        data-part="surface"
        data-value={selectedValue}
        {...surfaceProps}
        style={{ ...controlStyle, ...surfaceProps?.style }}
      >
        <Field.Control
          aria-hidden="true"
          as="input"
          disabled={disabled}
          fieldId={fieldId}
          invalid={invalid}
          readOnly
          required={required}
          tabIndex={-1}
          type="text"
          value={selectedValue}
          {...controlProps}
        />
        <input
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabel ? undefined : `${fieldId}-label`}
          data-part="native-input"
          disabled={disabled}
          id={inputId}
          type="color"
          value={selectedValue}
          required={required || undefined}
          {...(alpha ? { alpha: "" } : {})}
          {...(colorSpace ? { colorspace: colorSpace } : {})}
          {...inputProps}
          ref={mergedInputRef}
          onChange={composeEventHandlers(inputProps.onChange, (event) => {
            const nextValue = event.currentTarget.value;
            if (value === undefined) setUncontrolledValue(nextValue);
            onValueChange?.(nextValue);
          })}
        />
      </div>
    </Field.Root>
  );
}
ColorPicker.displayName = "ColorPicker";
