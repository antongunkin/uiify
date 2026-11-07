import type { ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import { composeEventHandlers } from "../../core/compose-event-handlers.js";
import type { ToggleProps } from "./types.js";

export function Toggle({
  id,
  label,
  pressed,
  defaultPressed = false,
  onPressedChange,
  disabled = false,
  className,
  slotProps,
  ...rootProps
}: ToggleProps): ReactElement {
  const isControlled = pressed !== undefined;
  const checked = isControlled ? pressed : undefined;

  const labelId = `${id}-label`;

  return (
    <div
      data-disabled={disabled ? "" : undefined}
      {...rootProps}
      className={cn("uiify-toggle", className)}
    >
      <input
        aria-labelledby={labelId}
        checked={checked}
        data-disabled={disabled ? "" : undefined}
        data-state={isControlled ? (pressed ? "on" : "off") : undefined}
        defaultChecked={!isControlled ? defaultPressed : undefined}
        disabled={disabled || undefined}
        id={id}
        type="checkbox"
        readOnly={isControlled && !onPressedChange && !slotProps?.control?.onChange}
        {...slotProps?.control}
        className={cn("uiify-toggle-control", slotProps?.control?.className)}
        onChange={
          onPressedChange
            ? composeEventHandlers(slotProps?.control?.onChange, (event) =>
                onPressedChange(event.currentTarget.checked),
              )
            : slotProps?.control?.onChange
        }
      />
      <label
        data-variant="outline"
        htmlFor={id}
        id={labelId}
        {...slotProps?.label}
        className={cn("uiify-button", slotProps?.label?.className)}
      >
        {label}
      </label>
    </div>
  );
}
Toggle.displayName = "Toggle";
