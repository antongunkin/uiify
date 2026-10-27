import type { ReactElement } from "react";
import { ChoiceGroup } from "../internal/choice-family/ChoiceGroup.js";
import type { ToggleGroupItem, ToggleGroupProps } from "./types.js";

export function ToggleGroup({
  id,
  items,
  type = "single",
  defaultValue,
  disabled = false,
  orientation = "horizontal",
  size,
  className,
  slotProps,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rootProps
}: ToggleGroupProps): ReactElement {
  const values = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  const resolvedItems = items.map((item) => ({
    ...item,
    disabled: disabled || item.disabled === true,
  }));

  return (
    <ChoiceGroup<ToggleGroupItem>
      {...(className !== undefined ? { className } : {})}
      rootProps={rootProps}
      id={id}
      items={resolvedItems}
      isChecked={(item) => values.includes(item.value)}
      kind={type}
      namespace="toggle-group"
      labelAttributes={{
        "data-uiify-button": "",
        "data-variant": "outline",
        ...(size !== undefined ? { "data-size": size } : {}),
      }}
      orientation={orientation}
      {...(slotProps !== undefined ? { slotProps } : {})}
      rootAttributes={{
        role: type === "single" ? "radiogroup" : "group",
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "data-disabled": disabled ? "" : undefined,
      }}
    />
  );
}
ToggleGroup.displayName = "ToggleGroup";
