import type { ReactElement } from "react";
import { composeEventHandlers } from "../../core/compose-event-handlers.js";
import type { ToggleProps } from "./types.js";

export function Toggle({
  id,
  label,
  pressed,
  defaultPressed = false,
  onPressedChange,
  disabled = false,
  slotProps,
  ...rootProps
}: ToggleProps): ReactElement {
  const isControlled = pressed !== undefined;
  const checked = isControlled ? pressed : undefined;

  const labelId = `${id}-label`;

  return (
    <div data-disabled={disabled ? "" : undefined} data-uiify-toggle="" {...rootProps}>
      <input
        aria-labelledby={labelId}
        checked={checked}
        data-disabled={disabled ? "" : undefined}
        data-part="control"
        data-state={isControlled ? (pressed ? "on" : "off") : undefined}
        defaultChecked={!isControlled ? defaultPressed : undefined}
        disabled={disabled || undefined}
        id={id}
        type="checkbox"
        readOnly={isControlled && !onPressedChange && !slotProps?.control?.onChange}
        {...slotProps?.control}
        onChange={
          onPressedChange
            ? composeEventHandlers(slotProps?.control?.onChange, (event) =>
                onPressedChange(event.currentTarget.checked),
              )
            : slotProps?.control?.onChange
        }
      />
      <label
        data-part="label"
        data-uiify-button=""
        data-variant="outline"
        htmlFor={id}
        id={labelId}
        {...slotProps?.label}
      >
        {label}
      </label>
    </div>
  );
}
Toggle.displayName = "Toggle";
