import type { ReactElement } from "react";
import { cn } from "@gunkin/uiify/core/render";
import { resolveRepeatedSlotProps } from "../../core/slot-props.js";
import { Checkbox } from "./Checkbox.js";
import type { CheckboxGroupShellProps } from "./types.js";

/**
 * Shared fieldset anatomy for the static and client group. Hook-free: the client entry supplies
 * checked values and change handlers.
 */
export function CheckboxGroupShell(props: CheckboxGroupShellProps): ReactElement {
  const {
    id,
    items,
    className,
    disabled,
    invalid,
    isChecked,
    isControlled,
    label,
    name,
    onItemChange,
    orientation,
    required,
    rootProps,
    selectAll,
    slotProps,
    ariaLabel,
    ariaLabelledBy,
  } = props;
  const resolvedItems = items.map((item) => ({
    ...item,
    disabled: disabled || item.disabled === true,
  }));

  return (
    <fieldset
      aria-invalid={invalid || undefined}
      data-disabled={disabled ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      data-orientation={orientation}
      data-required={required ? "" : undefined}
      id={id}
      {...rootProps}
      {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
      {...(ariaLabelledBy !== undefined ? { "aria-labelledby": ariaLabelledBy } : {})}
      className={cn("uiify-checkbox-group", className)}
    >
      {label !== undefined ? (
        <legend
          {...slotProps?.legend}
          className={cn("uiify-checkbox-group-legend", slotProps?.legend?.className)}
        >
          {label}
        </legend>
      ) : null}
      {selectAll}
      {resolvedItems.map((item) => {
        const inputSlot = resolveRepeatedSlotProps(slotProps?.input, item.value);
        const labelSlot = resolveRepeatedSlotProps(slotProps?.label, item.value);
        const itemSlotProps =
          Object.keys(inputSlot).length > 0 || Object.keys(labelSlot).length > 0
            ? {
                ...(Object.keys(inputSlot).length > 0 ? { input: inputSlot } : {}),
                ...(Object.keys(labelSlot).length > 0 ? { label: labelSlot } : {}),
              }
            : undefined;

        return (
          <Checkbox
            key={item.value}
            {...(isControlled ? { checked: isChecked(item) } : { defaultChecked: isChecked(item) })}
            disabled={item.disabled}
            id={`${id}-${item.value}`}
            label={item.label}
            {...(name !== undefined ? { name } : {})}
            {...(onItemChange
              ? { onCheckedChange: (checked: boolean) => onItemChange(item, checked) }
              : {})}
            {...(itemSlotProps !== undefined ? { slotProps: itemSlotProps } : {})}
            value={item.value}
          />
        );
      })}
    </fieldset>
  );
}
CheckboxGroupShell.displayName = "CheckboxGroupShell";
