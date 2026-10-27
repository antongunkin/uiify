"use client";

import { useId, useRef, useState, type CSSProperties, type ReactElement } from "react";
import { useMergedRefs } from "@gunkin/uiify/hooks";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { mergeRepeatedSlotProps, omitProps } from "../../core/slot-props.js";
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
    slotProps,
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

  const fieldProps = omitProps(
    mergeRepeatedSlotProps(
      { ...rootDataProps, className, style },
      slotProps?.field as Record<string, unknown> | undefined,
    ),
    [
      "children",
      "dangerouslySetInnerHTML",
      "data-disabled",
      "data-invalid",
      "data-part",
      "data-required",
      "data-uiify-color-picker",
      "data-uiify-field",
      "disabled",
      "id",
      "invalid",
      "required",
    ],
  );
  const labelProps = omitProps(slotProps?.label, [
    "children",
    "dangerouslySetInnerHTML",
    "data-disabled",
    "data-part",
    "data-required",
    "data-uiify-color-picker",
    "fieldId",
    "htmlFor",
    "id",
    "required",
  ]);
  const surfaceProps = omitProps(slotProps?.surface, [
    "children",
    "dangerouslySetInnerHTML",
    "data-part",
    "data-uiify-color-picker",
    "data-value",
  ]);
  const controlProps = omitProps(slotProps?.control, [
    "aria-describedby",
    "aria-hidden",
    "aria-invalid",
    "aria-labelledby",
    "aria-required",
    "children",
    "dangerouslySetInnerHTML",
    "defaultValue",
    "data-disabled",
    "data-invalid",
    "data-part",
    "data-required",
    "data-uiify-color-picker",
    "data-uiify-input",
    "disabled",
    "fieldId",
    "id",
    "name",
    "readOnly",
    "required",
    "tabIndex",
    "type",
    "value",
  ]);
  const inputProps = omitProps(
    mergeRepeatedSlotProps(
      nativeInputProps,
      omitProps(slotProps?.input, [
        "alpha",
        "aria-invalid",
        "aria-label",
        "aria-labelledby",
        "children",
        "colorspace",
        "data-part",
        "data-uiify-color-picker",
        "defaultValue",
        "disabled",
        "dangerouslySetInnerHTML",
        "id",
        "required",
        "type",
        "value",
      ]) as Record<string, unknown>,
    ),
    [
      "alpha",
      "aria-invalid",
      "aria-label",
      "aria-labelledby",
      "children",
      "colorspace",
      "data-part",
      "data-uiify-color-picker",
      "disabled",
      "defaultValue",
      "dangerouslySetInnerHTML",
      "id",
      "type",
      "value",
    ],
  );
  const mergedInputRef = useMergedRefs(ref, inputProps.ref as typeof ref, nativeInputRef);
  const slotOnChange = inputProps.onChange as typeof onChange;

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
      {...fieldProps}
      data-uiify-color-picker=""
      disabled={disabled}
      id={fieldId}
      invalid={invalid}
      required={required}
    >
      <Field.Label
        {...labelProps}
        disabled={disabled}
        fieldId={fieldId}
        onClick={composeEventHandlers(labelProps.onClick, (event) => {
          event.preventDefault();
          nativeInputRef.current?.click();
        })}
        required={required}
      >
        {label}
      </Field.Label>
      <div
        {...surfaceProps}
        data-part="surface"
        data-value={selectedValue}
        style={{ ...surfaceProps.style, ...controlStyle }}
      >
        <Field.Control
          {...controlProps}
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
          {...inputProps}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabel ? undefined : `${fieldId}-label`}
          data-part="native-input"
          disabled={disabled}
          id={inputId}
          onChange={(event) => {
            onChange?.(event);
            slotOnChange?.(event);
            if (event.defaultPrevented) return;
            const nextValue = event.currentTarget.value;
            if (value === undefined) setUncontrolledValue(nextValue);
            onValueChange?.(nextValue);
          }}
          type="color"
          value={selectedValue}
          required={required || undefined}
          ref={mergedInputRef}
          {...(alpha ? { alpha: "" } : {})}
          {...(colorSpace ? { colorspace: colorSpace } : {})}
        />
      </div>
    </Field.Root>
  );
}
ColorPicker.displayName = "ColorPicker";
