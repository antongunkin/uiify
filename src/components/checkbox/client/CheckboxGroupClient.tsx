"use client";

import type { ReactElement } from "react";
import { useControllableState } from "@gunkin/uiify/hooks";
import { CheckboxClient } from "./CheckboxClient.js";
import { CheckboxGroupShell } from "../CheckboxGroupShell.js";
import type {
  CheckedState,
  CheckboxGroupClientProps,
  CheckboxGroupItem,
  CheckboxGroupLabels,
} from "../types.js";

const defaultLabels: CheckboxGroupLabels = { selectAll: "Select all" };

function commonSlotProps<T extends { readonly byItemValue?: unknown }>(
  props: T,
): Omit<T, "byItemValue"> {
  const { byItemValue: _byItemValue, ...common } = props;
  return common;
}

export function CheckboxGroupClient({
  id,
  label,
  items,
  defaultValue,
  value,
  onValueChange,
  selectAll = false,
  labels,
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
}: CheckboxGroupClientProps): ReactElement {
  const [selected, setSelected] = useControllableState<readonly string[]>({
    defaultValue: defaultValue ?? [],
    ...(value !== undefined ? { value } : {}),
    ...(onValueChange !== undefined ? { onChange: onValueChange } : {}),
  });
  const enabledValues = items
    .filter((item) => !(disabled || item.disabled === true))
    .map((item) => item.value);
  const selectedEnabled = enabledValues.filter((itemValue) => selected.includes(itemValue));
  const allSelected = enabledValues.length > 0 && selectedEnabled.length === enabledValues.length;
  const someSelected = selectedEnabled.length > 0 && !allSelected;
  const resolvedLabels = { ...defaultLabels, ...labels };
  // Preserve the documented item ids while keeping the aggregate id unique for arbitrary values.
  const itemIds = new Set(items.map((item) => `${id}-${item.value}`));
  let selectAllId = `${id}-select-all`;
  while (itemIds.has(selectAllId)) selectAllId = `${selectAllId}-aggregate`;
  const selectAllChecked: CheckedState = allSelected
    ? true
    : someSelected
      ? "indeterminate"
      : false;

  const handleItemChange = (item: CheckboxGroupItem, checked: boolean) => {
    setSelected((currentValues) =>
      checked
        ? currentValues.includes(item.value)
          ? currentValues
          : [...currentValues, item.value]
        : currentValues.filter((currentValue) => currentValue !== item.value),
    );
  };

  const handleSelectAll = () => {
    setSelected((currentValues) => {
      const currentEnabled = enabledValues.filter((itemValue) => currentValues.includes(itemValue));
      if (enabledValues.length > 0 && currentEnabled.length === enabledValues.length) {
        return currentValues.filter((itemValue) => !enabledValues.includes(itemValue));
      }
      const nextValues = new Set(currentValues);
      for (const itemValue of enabledValues) nextValues.add(itemValue);
      return [...nextValues];
    });
  };

  const selectAllNode = selectAll ? (
    <div {...slotProps?.selectAll}>
      <CheckboxClient
        checked={selectAllChecked}
        disabled={disabled || enabledValues.length === 0}
        id={selectAllId}
        label={resolvedLabels.selectAll}
        onCheckedChange={handleSelectAll}
        slotProps={{
          ...(slotProps?.input !== undefined ? { input: commonSlotProps(slotProps.input) } : {}),
          ...(slotProps?.label !== undefined ? { label: commonSlotProps(slotProps.label) } : {}),
        }}
      />
    </div>
  ) : undefined;

  return (
    <CheckboxGroupShell
      {...(ariaLabel !== undefined ? { ariaLabel } : {})}
      {...(ariaLabelledBy !== undefined ? { ariaLabelledBy } : {})}
      {...(className !== undefined ? { className } : {})}
      disabled={disabled}
      id={id}
      invalid={invalid}
      isChecked={(item) => selected.includes(item.value)}
      isControlled
      {...(label !== undefined ? { label } : {})}
      items={items}
      {...(name !== undefined ? { name } : {})}
      onItemChange={handleItemChange}
      orientation={orientation}
      required={required}
      rootProps={rootProps}
      {...(selectAllNode !== undefined ? { selectAll: selectAllNode } : {})}
      {...(slotProps !== undefined ? { slotProps } : {})}
    />
  );
}
CheckboxGroupClient.displayName = "CheckboxGroupClient";
