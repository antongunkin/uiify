import type { ChangeEvent, ReactElement } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { cn } from "@gunkin/uiify/core/render";
import { mergeRepeatedSlotProps } from "../../../core/slot-props.js";
import type { NativeCheckControlProps } from "./types.js";

/**
 * Hook-free native checkbox base shared by the Tier 0 `Checkbox`, the client wrapper and
 * Table selection. It owns boolean `checked`/`defaultChecked` and the checked/unchecked
 * `data-state`; the mixed state is layered on by `NativeCheckControlClient` after hydration.
 */
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
    ...nativeProps
  } = props;
  const isControlled = checked !== undefined;
  const inputProps = slotProps?.input ?? {};
  const labelProps = mergeRepeatedSlotProps({ className }, slotProps?.label);
  const checkedValue = checked === true;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(event.currentTarget.checked);
  };
  // Order: top-level onChange, then slot onChange, then the library handler.
  // No handler at all stays undefined so Server Components never pass a function prop.
  type ChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;
  let handleInputChange: ChangeHandler | undefined = onCheckedChange ? handleChange : undefined;
  for (const consumer of [inputProps.onChange, nativeProps.onChange]) {
    if (!consumer) continue;
    handleInputChange = handleInputChange
      ? composeEventHandlers(consumer, handleInputChange)
      : consumer;
  }

  const input = (
    <input
      aria-label={label === undefined ? ariaLabel : undefined}
      aria-labelledby={label !== undefined ? `${id}-label` : undefined}
      checked={isControlled ? checkedValue : undefined}
      data-disabled={disabled ? "" : undefined}
      data-state={isControlled ? (checkedValue ? "checked" : "unchecked") : undefined}
      defaultChecked={!isControlled ? defaultChecked : undefined}
      disabled={disabled || undefined}
      id={id}
      name={name}
      type="checkbox"
      value={value}
      {...nativeProps}
      {...inputProps}
      className={cn(
        "uiify-checkbox-control",
        label === undefined ? className : undefined,
        inputProps.className,
      )}
      onChange={handleInputChange}
    />
  );

  return label === undefined ? (
    input
  ) : (
    <label
      id={`${id}-label`}
      {...labelProps}
      className={cn("uiify-checkbox", labelProps.className)}
    >
      {input}
      {label}
    </label>
  );
}
NativeCheckControl.displayName = "NativeCheckControl";
