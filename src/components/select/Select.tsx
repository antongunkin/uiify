import type { ElementType, ReactElement, SyntheticEvent } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type {
  SelectRootProps,
  SelectContentOwnProps,
  SelectItemProps,
  SelectGroupProps,
  SelectSeparatorProps,
} from "./types.js";

export function SelectRoot<TAs extends ElementType = "select">(
  props: SelectRootProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    value,
    defaultValue,
    onValueChange,
    name,
    disabled = false,
    children: consumerChildren,
    ...consumerProps
  } = props as SelectRootProps<"select">;

  const isControlled = value !== undefined;

  const handleChange = (event: SyntheticEvent<HTMLSelectElement>): void => {
    onValueChange?.(event.currentTarget.value);
  };

  const consumerOnChange = (
    consumerProps as Record<string, unknown> & {
      onChange?: (event: SyntheticEvent<HTMLSelectElement>) => void;
    }
  ).onChange;

  return useRenderElement({
    as,
    defaultTag: "select",
    props: {
      ...consumerProps,
      children: consumerChildren,
      "data-disabled": disabled ? "" : undefined,
      disabled: disabled || undefined,
      name,
      onChange: composeEventHandlers(consumerOnChange, handleChange),
      ...(isControlled ? { value } : defaultValue !== undefined ? { defaultValue } : {}),
    },
    render,
    state: { disabled },
  });
}

export function SelectContent(props: SelectContentOwnProps): React.ReactNode {
  return props.children ?? null;
}

export function SelectItem<TAs extends ElementType = "option">(
  props: SelectItemProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    children,
    disabled = false,
    value,
    ...consumerProps
  } = props as SelectItemProps<"option">;

  return useRenderElement({
    as,
    defaultTag: "option",
    props: {
      ...consumerProps,
      disabled: disabled || undefined,
      value,
      children,
    },
    render,
    state: { disabled },
  });
}

export function SelectGroup<TAs extends ElementType = "optgroup">(
  props: SelectGroupProps<TAs>,
): ReactElement | null {
  const { as, render, children, label, ...consumerProps } = props as SelectGroupProps<"optgroup">;

  return useRenderElement({
    as,
    defaultTag: "optgroup",
    props: {
      ...consumerProps,
      label,
      children,
    },
    render,
    state: { label },
  });
}
SelectGroup.displayName = "SelectGroup";

export function SelectSeparator<TAs extends ElementType = "hr">(
  props: SelectSeparatorProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as SelectSeparatorProps<"hr">;

  return useRenderElement({
    as,
    defaultTag: "hr",
    props: { ...consumerProps, "data-part": "separator" },
    render,
    state: {},
  });
}
SelectSeparator.displayName = "SelectSeparator";

export const Select = {
  Content: SelectContent,
  Group: SelectGroup,
  Item: SelectItem,
  Root: SelectRoot,
  Separator: SelectSeparator,
};
