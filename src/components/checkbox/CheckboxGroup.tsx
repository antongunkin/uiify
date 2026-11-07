import type { ReactElement } from "react";
import { CheckboxGroupShell } from "./CheckboxGroupShell.js";
import type { CheckboxGroupProps } from "./types.js";

export function CheckboxGroup({
  id,
  label,
  items,
  defaultValue,
  name,
  disabled = false,
  required = false,
  invalid = false,
  orientation = "vertical",
  className,
  slotProps,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rootProps
}: CheckboxGroupProps): ReactElement {
  const values = defaultValue ?? [];

  return (
    <CheckboxGroupShell
      {...(ariaLabel !== undefined ? { ariaLabel } : {})}
      {...(ariaLabelledBy !== undefined ? { ariaLabelledBy } : {})}
      {...(className !== undefined ? { className } : {})}
      disabled={disabled}
      id={id}
      invalid={invalid}
      isChecked={(item) => values.includes(item.value)}
      isControlled={false}
      {...(label !== undefined ? { label } : {})}
      items={items}
      {...(name !== undefined ? { name } : {})}
      orientation={orientation}
      required={required}
      rootProps={rootProps}
      {...(slotProps !== undefined ? { slotProps } : {})}
    />
  );
}
CheckboxGroup.displayName = "CheckboxGroup";
