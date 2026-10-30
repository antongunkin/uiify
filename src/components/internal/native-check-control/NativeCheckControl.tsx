"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, ReactElement } from "react";
import { useMergedRefs } from "@gunkin/uiify/hooks";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { mergeRepeatedSlotProps } from "../../../core/slot-props.js";
import type { NativeCheckControlProps } from "./types.js";

export function NativeCheckControl(props: NativeCheckControlProps): ReactElement {
  const {
    checked,
    defaultChecked,
    disabled = false,
    id,
    label,
    name,
    onCheckedChange,
    className,
    slotProps,
    value,
    "aria-label": ariaLabel,
  } = props;
  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputProps = slotProps?.input ?? {};
  const labelProps = mergeRepeatedSlotProps({ className }, slotProps?.label);
  const mergedInputRef = useMergedRefs(inputProps.ref, inputRef);
  const checkedValue = isControlled ? checked === true : uncontrolledChecked;

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = checked === "indeterminate";
  }, [checked]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (checked === "indeterminate" && inputRef.current) {
      inputRef.current.indeterminate = true;
    }
    if (!isControlled) setUncontrolledChecked(event.currentTarget.checked);
    onCheckedChange?.(event.currentTarget.checked);
  };

  const input = (
    <input
      aria-checked={checked === "indeterminate" ? "mixed" : undefined}
      aria-label={label === undefined ? ariaLabel : undefined}
      aria-labelledby={label !== undefined ? `${id}-label` : undefined}
      checked={isControlled ? checkedValue : undefined}
      data-disabled={disabled ? "" : undefined}
      data-state={
        isControlled
          ? checked === "indeterminate"
            ? "indeterminate"
            : checkedValue
              ? "checked"
              : "unchecked"
          : undefined
      }
      defaultChecked={!isControlled ? defaultChecked : undefined}
      disabled={disabled || undefined}
      id={id}
      name={name}
      type="checkbox"
      value={value}
      {...(label === undefined ? { "data-uiify-checkbox": "" } : { "data-part": "control" })}
      {...inputProps}
      onChange={composeEventHandlers(inputProps.onChange, handleChange)}
      ref={mergedInputRef}
    />
  );

  return label === undefined ? (
    input
  ) : (
    <label data-uiify-checkbox="" id={`${id}-label`} {...labelProps}>
      {input}
      {label}
    </label>
  );
}
NativeCheckControl.displayName = "NativeCheckControl";
