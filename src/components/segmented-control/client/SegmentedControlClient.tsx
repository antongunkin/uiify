"use client";

import type { ReactElement } from "react";
import { useControllableState } from "@gunkin/uiify/hooks";
import { ChoiceGroup } from "../../internal/choice-family/ChoiceGroup.js";
import type { SegmentedControlClientProps, SegmentedControlItem } from "../types.js";

export function SegmentedControlClient({
  id,
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  orientation = "horizontal",
  fullWidth = false,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SegmentedControlClientProps): ReactElement {
  const [selectedValue, setSelectedValue] = useControllableState<string | undefined>({
    defaultValue,
    onChange: (nextValue) => {
      if (nextValue !== undefined) onChange?.(nextValue);
    },
    value: controlledValue,
  });
  const resolvedItems = items.map((item) => ({
    ...item,
    disabled: disabled || item.disabled === true,
  }));

  return (
    <ChoiceGroup<SegmentedControlItem>
      {...(className !== undefined ? { className } : {})}
      id={id}
      items={resolvedItems}
      isChecked={(item) => item.value === selectedValue}
      isControlled={controlledValue !== undefined}
      kind="single"
      namespace="segmented-control"
      onItemChange={(item) => setSelectedValue(item.value)}
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

SegmentedControlClient.displayName = "SegmentedControlClient";
