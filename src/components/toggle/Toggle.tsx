import type { ReactElement } from "react";
import { omitProps } from "../../core/slot-props.js";
import type { ToggleProps } from "./types.js";

export function Toggle({
  id,
  label,
  pressed,
  defaultPressed = false,
  disabled = false,
  slotProps,
  ...rootProps
}: ToggleProps): ReactElement {
  const isControlled = pressed !== undefined;
  const checked = isControlled ? pressed : undefined;

  const labelId = `${id}-label`;

  return (
    <div
      {...omitProps(rootProps, [
        "children",
        "dangerouslySetInnerHTML",
        "data-disabled",
        "data-uiify-toggle",
        "id",
      ])}
      data-disabled={disabled ? "" : undefined}
      data-uiify-toggle=""
    >
      <input
        {...omitProps(slotProps?.control, [
          "aria-labelledby",
          "checked",
          "data-disabled",
          "data-part",
          "data-state",
          "data-uiify-toggle",
          "defaultChecked",
          "disabled",
          "id",
          "type",
        ])}
        aria-labelledby={labelId}
        checked={checked}
        data-disabled={disabled ? "" : undefined}
        data-part="control"
        data-state={isControlled ? (pressed ? "on" : "off") : undefined}
        defaultChecked={!isControlled ? defaultPressed : undefined}
        disabled={disabled || undefined}
        id={id}
        type="checkbox"
      />
      <label
        {...omitProps(slotProps?.label, [
          "data-part",
          "data-uiify-button",
          "data-variant",
          "htmlFor",
          "id",
        ])}
        data-part="label"
        data-uiify-button=""
        data-variant="outline"
        htmlFor={id}
        id={labelId}
      >
        {label}
      </label>
    </div>
  );
}
Toggle.displayName = "Toggle";
