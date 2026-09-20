import type { ReactElement } from "react";
import type { ToggleProps } from "./types.js";

export function Toggle({
  id,
  label,
  pressed,
  defaultPressed = false,
  disabled = false,
  className,
}: ToggleProps): ReactElement {
  const isControlled = pressed !== undefined;
  const checked = isControlled ? pressed : undefined;

  const labelId = `${id}-label`;

  return (
    <div data-disabled={disabled ? "" : undefined} data-uiify-toggle="">
      <input
        aria-labelledby={labelId}
        checked={checked}
        data-disabled={disabled ? "" : undefined}
        data-state={isControlled ? (pressed ? "on" : "off") : undefined}
        defaultChecked={!isControlled ? defaultPressed : undefined}
        disabled={disabled || undefined}
        id={id}
        type="checkbox"
      />
      <label className={className} data-part="label" htmlFor={id} id={labelId}>
        {label}
      </label>
    </div>
  );
}
Toggle.displayName = "Toggle";
