import type { ElementType, ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import type { InputGroupAddonProps, InputGroupRootProps } from "./types.js";

export function InputGroup<TAs extends ElementType = "div">(
  props: InputGroupRootProps<TAs>,
): ReactElement | null {
  const { as, render, children, size, ...consumerProps } = props as InputGroupRootProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...(size !== undefined ? { "data-size": size } : {}),
      ...consumerProps,
      children,
      className: cn(
        "uiify-input-group",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
    },
    render,
    state: {},
  });
}

export function InputGroupAddon<TAs extends ElementType = "span">(
  props: InputGroupAddonProps<TAs>,
): ReactElement | null {
  const { as, render, align, children, ...consumerProps } = props as InputGroupAddonProps<"span">;
  return useRenderElement({
    as,
    defaultTag: "span",
    props: {
      "data-align": align,
      ...consumerProps,
      children,
      className: cn(
        "uiify-input-group-addon",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
    },
    render,
    state: {},
  });
}
