"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, ReactElement } from "react";
import type { CheckboxProps } from "./types.js";

export function Checkbox(props: CheckboxProps): ReactElement {
  const {
    checked,
    defaultChecked,
    disabled = false,
    id,
    label,
    onCheckedChange,
    className,
    "aria-label": ariaLabel,
  } = props;
  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);
  const inputRef = useRef<HTMLInputElement | null>(null);
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
      onChange={handleChange}
      ref={inputRef}
      type="checkbox"
    />
  );

  return label === undefined ? (
    input
  ) : (
    <label className={className} id={`${id}-label`}>
      {input}
      {label}
    </label>
  );
}
Checkbox.displayName = "Checkbox";
