import type { ElementType, ReactElement, SyntheticEvent } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { TextareaProps } from "./types.js";

export function Textarea<TAs extends ElementType = "textarea">(
  props: TextareaProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    value,
    defaultValue,
    onValueChange,
    autoSize = false,
    disabled = false,
    readOnly = false,
    invalid = false,
    ...consumerProps
  } = props as TextareaProps<"textarea">;

  const isControlled = value !== undefined;

  const handleChange = (event: SyntheticEvent<HTMLTextAreaElement>): void => {
    onValueChange?.(event.currentTarget.value);
  };

  const consumerOnChange = (
    consumerProps as Record<string, unknown> & {
      onChange?: (event: SyntheticEvent<HTMLTextAreaElement>) => void;
    }
  ).onChange;

  return useRenderElement({
    as,
    defaultTag: "textarea",
    props: {
      ...consumerProps,
      "aria-invalid": invalid || undefined,
      "data-autosize": autoSize ? "" : undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-readonly": readOnly ? "" : undefined,
      "data-invalid": invalid ? "" : undefined,
      disabled: disabled || undefined,
      readOnly: readOnly || undefined,
      onChange: composeEventHandlers(consumerOnChange, handleChange),
      ...(isControlled ? { value } : defaultValue !== undefined ? { defaultValue } : {}),
    },
    render,
    state: { autoSize, disabled, readOnly, invalid },
  });
}
