import type { ReactElement } from "react";
import { ChoiceGroup } from "../internal/choice-family/ChoiceGroup.js";
import type { RadioGroupItem, RadioGroupProps } from "./types.js";

export function RadioGroup({
  id,
  items,
  defaultValue,
  name,
  disabled = false,
  orientation = "vertical",
  className,
  "aria-label": ariaLabel,
}: RadioGroupProps): ReactElement {
  const resolvedItems = items.map((item) => ({
    ...item,
    disabled: disabled || item.disabled === true,
  }));

  return (
    <ChoiceGroup<RadioGroupItem>
      {...(className !== undefined ? { className } : {})}
      {...(name !== undefined ? { name } : {})}
      id={id}
      items={resolvedItems}
      isChecked={(item) => item.value === defaultValue}
      itemInputClassName={(item) => item.className}
      kind="single"
      labelPart
      namespace="radio-group"
      orientation={orientation}
      rootAttributes={{ "aria-label": ariaLabel, "data-disabled": disabled ? "" : undefined }}
    />
  );
}
RadioGroup.displayName = "RadioGroup";
