import type { ReactElement } from "react";
import { ChoiceGroup } from "../internal/choice-family/ChoiceGroup.js";
import type { SegmentedControlItem, SegmentedControlProps } from "./types.js";

export function SegmentedControl({
  id,
  items,
  defaultValue,
  disabled = false,
  orientation = "horizontal",
  fullWidth = false,
  className,
  slotProps,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rootProps
}: SegmentedControlProps): ReactElement {
  const resolvedItems = items.map((item) => ({
    ...item,
    disabled: disabled || item.disabled === true,
  }));

  return (
    <ChoiceGroup<SegmentedControlItem>
      {...(className !== undefined ? { className } : {})}
      rootProps={rootProps}
      id={id}
      items={resolvedItems}
      isChecked={(item) => item.value === defaultValue}
      kind="single"
      namespace="segmented-control"
      labelAttributes={{ "data-uiify-button": "", "data-variant": "ghost", "data-size": "sm" }}
      orientation={orientation}
      {...(slotProps !== undefined ? { slotProps } : {})}
      rootAttributes={{
        role: "radiogroup",
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "data-disabled": disabled ? "" : undefined,
        "data-full-width": fullWidth ? "" : undefined,
      }}
    />
  );
}
SegmentedControl.displayName = "SegmentedControl";
