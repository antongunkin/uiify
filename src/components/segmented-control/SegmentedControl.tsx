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
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SegmentedControlProps): ReactElement {
  const resolvedItems = items.map((item) => ({
    ...item,
    disabled: disabled || item.disabled === true,
  }));

  return (
    <ChoiceGroup<SegmentedControlItem>
      {...(className !== undefined ? { className } : {})}
      id={id}
      items={resolvedItems}
      isChecked={(item) => item.value === defaultValue}
      kind="single"
      namespace="segmented-control"
      orientation={orientation}
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
