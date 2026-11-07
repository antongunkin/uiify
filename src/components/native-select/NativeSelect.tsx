import type { ElementType, ReactElement, SyntheticEvent } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { cn } from "../../core/class-names.js";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type {
  NativeSelectMultiOwnProps,
  NativeSelectProps,
  NativeSelectSingleOwnProps,
  NativeSelectContentOwnProps,
  NativeSelectOptionProps,
  NativeSelectOptGroupProps,
  NativeSelectSeparatorProps,
} from "./types.js";

export function NativeSelect<TAs extends ElementType = "select">(
  props: NativeSelectProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    value,
    defaultValue,
    onValueChange,
    multiple = false,
    name,
    disabled = false,
    size,
    children: consumerChildren,
    ...consumerProps
  } = props as NativeSelectProps<"select">;

  const isControlled = value !== undefined;

  const handleChange = (event: SyntheticEvent<HTMLSelectElement>): void => {
    if (multiple) {
      (onValueChange as NativeSelectMultiOwnProps["onValueChange"])?.(
        Array.from(event.currentTarget.selectedOptions, (option) => option.value),
      );
      return;
    }
    (onValueChange as NativeSelectSingleOwnProps["onValueChange"])?.(event.currentTarget.value);
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
      className: cn("uiify-native-select", consumerProps.className as string | undefined),
      children: consumerChildren,
      ...(size !== undefined ? { "data-size": size } : {}),
      "data-disabled": disabled ? "" : undefined,
      disabled: disabled || undefined,
      multiple: multiple || undefined,
      name,
      onChange: onValueChange
        ? composeEventHandlers(consumerOnChange, handleChange)
        : consumerOnChange,
      ...(isControlled ? { value } : defaultValue !== undefined ? { defaultValue } : {}),
    },
    render,
    state: { disabled },
  });
}

export function NativeSelectContent(props: NativeSelectContentOwnProps): React.ReactNode {
  return props.children ?? null;
}

export function NativeSelectOption<TAs extends ElementType = "option">(
  props: NativeSelectOptionProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    children,
    disabled = false,
    value,
    ...consumerProps
  } = props as NativeSelectOptionProps<"option">;

  return useRenderElement({
    as,
    defaultTag: "option",
    props: {
      ...consumerProps,
      className: cn("uiify-native-select-item", consumerProps.className as string | undefined),
      disabled: disabled || undefined,
      value,
      children,
    },
    render,
    state: { disabled },
  });
}

export function NativeSelectOptGroup<TAs extends ElementType = "optgroup">(
  props: NativeSelectOptGroupProps<TAs>,
): ReactElement | null {
  const { as, render, children, label, ...consumerProps } =
    props as NativeSelectOptGroupProps<"optgroup">;

  return useRenderElement({
    as,
    defaultTag: "optgroup",
    props: {
      ...consumerProps,
      className: cn("uiify-native-select-group", consumerProps.className as string | undefined),
      label,
      children,
    },
    render,
    state: { label },
  });
}
NativeSelectOptGroup.displayName = "NativeSelectOptGroup";

export function NativeSelectSeparator<TAs extends ElementType = "hr">(
  props: NativeSelectSeparatorProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as NativeSelectSeparatorProps<"hr">;

  return useRenderElement({
    as,
    defaultTag: "hr",
    props: {
      ...consumerProps,
      className: cn("uiify-native-select-separator", consumerProps.className as string | undefined),
    },
    render,
    state: {},
  });
}
NativeSelectSeparator.displayName = "NativeSelectSeparator";
