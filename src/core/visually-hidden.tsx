import type { CSSProperties, ElementType, ReactElement } from "react";
import type { RenderableProps } from "./polymorphic.js";
import { useRenderElement } from "./use-render-element.js";

const visuallyHiddenStyle: CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
};

export type VisuallyHiddenProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  object,
  Record<string, never>,
  HTMLElement
>;

export function VisuallyHidden<TAs extends ElementType = "span">(
  props: VisuallyHiddenProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    style: consumerStyle,
    ...consumerProps
  } = props as VisuallyHiddenProps<ElementType> & { style?: CSSProperties };
  return useRenderElement({
    as,
    defaultTag: "span",
    props: {
      ...consumerProps,
      style: { ...consumerStyle, ...visuallyHiddenStyle },
    },
    render,
    state: {},
  });
}
