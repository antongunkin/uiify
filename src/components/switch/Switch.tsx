import type { ElementType, ReactElement, SyntheticEvent } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
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
      // Library defaults first: consumer values replace them (hard rule 4).
      type: "checkbox",
      role: "switch",
      disabled: disabled || undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-state": isControlled ? (checked ? "checked" : "unchecked") : undefined,
      ...consumerProps,
      className: cn("uiify-switch", consumerProps.className),
      // No handler at all stays undefined, so a Server Component never passes a function prop.
      onChange: onCheckedChange
        ? composeEventHandlers(consumerOnChange, handleChange)
        : consumerOnChange,
      ...(isControlled ? { checked } : defaultChecked !== undefined ? { defaultChecked } : {}),
    },
    render,
    state: { disabled, checked: checked ?? false },
  });
}
