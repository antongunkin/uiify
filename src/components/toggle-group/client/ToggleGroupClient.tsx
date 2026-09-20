"use client";

import type { ReactElement } from "react";
import { useControllableState } from "@gunkin/uiify/hooks";
import { ChoiceGroup } from "../../internal/choice-family/ChoiceGroup.js";
import type { ToggleGroupClientProps, ToggleGroupItem } from "../types.js";

function normalizeSingle(value: string | readonly string[] | undefined): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

function normalizeMultiple(value: string | readonly string[] | undefined): readonly string[] {
  return value === undefined ? [] : typeof value === "string" ? [value] : value;
}

export function ToggleGroupClient({
  id,
  items,
  type = "single",
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  orientation = "horizontal",
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: ToggleGroupClientProps): ReactElement {
  if (type === "multiple") {
    return (
      <MultipleToggleGroupClient
        ariaLabel={ariaLabel}
        ariaLabelledBy={ariaLabelledBy}
        className={className}
        controlledValue={controlledValue}
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        items={items}
        onChange={onChange}
        orientation={orientation}
      />
    );
  }

  return (
    <SingleToggleGroupClient
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
      className={className}
      controlledValue={controlledValue}
      defaultValue={defaultValue}
      disabled={disabled}
      id={id}
      items={items}
      onChange={onChange}
      orientation={orientation}
    />
  );
}

interface ToggleGroupClientBranchProps {
  readonly ariaLabel?: string | undefined;
  readonly ariaLabelledBy?: string | undefined;
  readonly className?: string | undefined;
  readonly controlledValue?: string | readonly string[] | undefined;
  readonly defaultValue?: string | readonly string[] | undefined;
  readonly disabled: boolean;
  readonly id: string;
  readonly items: readonly ToggleGroupItem[];
  readonly onChange?: ((value: string | readonly string[]) => void) | undefined;
  readonly orientation: "horizontal" | "vertical";
}

function SingleToggleGroupClient({
  ariaLabel,
  ariaLabelledBy,
  className,
  controlledValue,
  defaultValue,
  disabled,
  id,
  items,
  onChange,
  orientation,
}: ToggleGroupClientBranchProps): ReactElement {
  const [selectedValue, setSelectedValue] = useControllableState<string | undefined>({
    defaultValue: normalizeSingle(defaultValue),
    onChange: (nextValue) => {
      if (nextValue !== undefined) onChange?.(nextValue);
    },
    value: normalizeSingle(controlledValue),
  });
  const resolvedItems = items.map((item) => ({
    ...item,
    disabled: disabled || item.disabled === true,
  }));

  return (
    <ChoiceGroup<ToggleGroupItem>
      {...(className !== undefined ? { className } : {})}
      id={id}
      items={resolvedItems}
      isChecked={(item) => item.value === selectedValue}
      isControlled={controlledValue !== undefined}
      kind="single"
      namespace="toggle-group"
      onItemChange={(item) => setSelectedValue(item.value)}
      orientation={orientation}
      rootAttributes={{
        role: "radiogroup",
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "data-disabled": disabled ? "" : undefined,
      }}
    />
  );
}

SingleToggleGroupClient.displayName = "SingleToggleGroupClient";

function MultipleToggleGroupClient({
  ariaLabel,
  ariaLabelledBy,
  className,
  controlledValue,
  defaultValue,
  disabled,
  id,
  items,
  onChange,
  orientation,
}: ToggleGroupClientBranchProps): ReactElement {
  const [selectedValues, setSelectedValues] = useControllableState<readonly string[]>({
    defaultValue: normalizeMultiple(defaultValue),
    onChange,
    value: controlledValue === undefined ? undefined : normalizeMultiple(controlledValue),
  });
  const resolvedItems = items.map((item) => ({
    ...item,
    disabled: disabled || item.disabled === true,
  }));

  return (
    <ChoiceGroup<ToggleGroupItem>
      {...(className !== undefined ? { className } : {})}
      id={id}
      items={resolvedItems}
      isChecked={(item) => selectedValues.includes(item.value)}
      isControlled={controlledValue !== undefined}
      kind="multiple"
      namespace="toggle-group"
      onItemChange={(item) =>
        setSelectedValues((currentValues) =>
          currentValues.includes(item.value)
            ? currentValues.filter((value) => value !== item.value)
            : [...currentValues, item.value],
        )
      }
      orientation={orientation}
      rootAttributes={{
        role: "group",
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "data-disabled": disabled ? "" : undefined,
      }}
    />
  );
}

MultipleToggleGroupClient.displayName = "MultipleToggleGroupClient";
ToggleGroupClient.displayName = "ToggleGroupClient";
