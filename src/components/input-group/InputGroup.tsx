import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { InputGroupAddonProps, InputGroupRootProps } from "./types.js";

export function InputGroup<TAs extends ElementType = "div">(
  props: InputGroupRootProps<TAs>,
): ReactElement | null {
  const { as, render, children, ...consumerProps } = props as InputGroupRootProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      children,
      "data-part": "root",
      "data-uiify-input-group": "",
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
      ...consumerProps,
      children,
      "data-align": align,
      "data-part": "addon",
      "data-uiify-input-group": "",
    },
    render,
    state: {},
  });
}
