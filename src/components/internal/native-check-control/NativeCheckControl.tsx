"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, ReactElement } from "react";
import { useMergedRefs } from "@gunkin/uiify/hooks";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { mergeRepeatedSlotProps, omitProps } from "../../../core/slot-props.js";
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
  const inputProps = omitProps(slotProps?.input, [
    "aria-checked",
    "aria-label",
    "aria-labelledby",
    "checked",
    "children",
    "dangerouslySetInnerHTML",
    "data-disabled",
    "data-part",
    "data-state",
    "data-uiify-checkbox",
    "defaultChecked",
    "defaultValue",
    "disabled",
    "id",
    "name",
    "type",
    "value",
  ]);
  const labelProps = omitProps(mergeRepeatedSlotProps({ className }, slotProps?.label), [
    "children",
    "dangerouslySetInnerHTML",
    "data-uiify-checkbox",
    "htmlFor",
    "id",
  ]);
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
      {...inputProps}
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
      onChange={composeEventHandlers(inputProps.onChange, handleChange)}
      ref={mergedInputRef}
      type="checkbox"
      value={value}
      {...(label === undefined ? { "data-uiify-checkbox": "" } : { "data-part": "control" })}
    />
  );

  return label === undefined ? (
    input
  ) : (
    <label {...labelProps} data-uiify-checkbox="" id={`${id}-label`}>
      {input}
      {label}
    </label>
  );
}
NativeCheckControl.displayName = "NativeCheckControl";
