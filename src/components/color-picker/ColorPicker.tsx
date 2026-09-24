"use client";

import { useId, useRef, useState, type CSSProperties, type ReactElement } from "react";
import { Field } from "../field/index.js";
import type { ColorPickerProps } from "./types.js";

export function ColorPicker(props: ColorPickerProps): ReactElement {
  const {
    alpha = false,
    "aria-label": ariaLabel,
    "aria-invalid": ariaInvalid,
    className,
    colorSpace,
    defaultValue = "#2563eb",
    disabled = false,
    id,
    label,
    onChange,
    onValueChange,
    ref,
    style,
    value,
    ...nativeProps
  } = props;
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
      className={className}
      {...rootDataProps}
      data-uiify-color-picker=""
      disabled={disabled}
      id={fieldId}
      invalid={invalid}
      required={required}
      style={style}
    >
      <Field.Label
        disabled={disabled}
        fieldId={fieldId}
        onClick={(event) => {
          event.preventDefault();
          nativeInputRef.current?.click();
        }}
        required={required}
      >
        {label}
      </Field.Label>
      <div data-part="surface" data-value={selectedValue} style={controlStyle}>
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
        />
        <input
          {...nativeInputProps}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabel ? undefined : `${fieldId}-label`}
          data-part="native-input"
          disabled={disabled}
          id={inputId}
          onChange={(event) => {
            const nextValue = event.currentTarget.value;
            if (value === undefined) setUncontrolledValue(nextValue);
            onValueChange?.(nextValue);
            onChange?.(event);
          }}
          type="color"
          value={selectedValue}
          ref={(element) => {
            nativeInputRef.current = element;
            if (typeof ref === "function") return ref(element);
            else if (ref) ref.current = element;
          }}
          {...(alpha ? { alpha: "" } : {})}
          {...(colorSpace ? { colorspace: colorSpace } : {})}
        />
      </div>
    </Field.Root>
  );
}
ColorPicker.displayName = "ColorPicker";
