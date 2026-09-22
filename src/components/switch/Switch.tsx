import type { ElementType, ReactElement, SyntheticEvent } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { SwitchProps } from "./types.js";

export function Switch<TAs extends ElementType = "input">(
  props: SwitchProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    checked,
    defaultChecked,
    onCheckedChange,
    disabled = false,
    ...consumerProps
  } = props as SwitchProps<"input">;

  const isControlled = checked !== undefined;

  const handleChange = (event: SyntheticEvent<HTMLInputElement>): void => {
    if (disabled) return;
    onCheckedChange?.(event.currentTarget.checked);
  };

  const consumerOnChange = (
    consumerProps as Record<string, unknown> & {
      onChange?: (event: SyntheticEvent<HTMLInputElement>) => void;
    }
  ).onChange;

  return useRenderElement({
    as,
    defaultTag: "input",
    props: {
      ...consumerProps,
      type: "checkbox",
      role: "switch",
      disabled: disabled || undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-state": isControlled ? (checked ? "checked" : "unchecked") : undefined,
      "data-uiify-switch": "",
      onChange: composeEventHandlers(consumerOnChange, handleChange),
      ...(isControlled ? { checked } : defaultChecked !== undefined ? { defaultChecked } : {}),
    },
    render,
    state: { disabled, checked: checked ?? false },
  });
}
