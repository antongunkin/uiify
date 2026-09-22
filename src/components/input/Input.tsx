import type { ElementType, ReactElement, SyntheticEvent } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { InputProps } from "./types.js";

export function Input<TAs extends ElementType = "input">(
  props: InputProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    readOnly = false,
    invalid = false,
    ...consumerProps
  } = props as InputProps<"input">;

  const isControlled = value !== undefined;

  const handleChange = (event: SyntheticEvent<HTMLInputElement>): void => {
    onValueChange?.(event.currentTarget.value);
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
      "data-uiify-input": "",
      "aria-invalid": invalid || undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-readonly": readOnly ? "" : undefined,
      "data-invalid": invalid ? "" : undefined,
      disabled: disabled || undefined,
      readOnly: readOnly || undefined,
      onChange: composeEventHandlers(consumerOnChange, handleChange),
      ...(isControlled ? { value } : defaultValue !== undefined ? { defaultValue } : {}),
    },
    render,
    state: { disabled, readOnly, invalid },
  });
}
