import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { layoutAttributes } from "../../core/layout/index.js";
import type { TextProps, HeadingProps } from "./types.js";

export function Text<TAs extends ElementType = "p">(props: TextProps<TAs>): ReactElement | null {
  const {
    as,
    render,
    size,
    weight,
    tone,
    leading,
    align,
    measure,
    wrap,
    responsive,
    ...consumerProps
  } = props as TextProps<"p">;
  return useRenderElement({
    as,
    defaultTag: "p",
    render,
    state: {},
    props: {
      ...layoutAttributes("Text", {
        size,
        weight,
        tone,
        leading,
        align,
        measure,
        wrap,
        responsive,
      }),
      ...consumerProps,
    },
  });
}
Text.displayName = "Text";

export function Heading<TAs extends ElementType = "h2">(
  props: HeadingProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    size,
    weight,
    tone,
    leading,
    align,
    measure,
    wrap,
    responsive,
    level = 2,
    ...consumerProps
  } = props as HeadingProps<"h2">;
  return useRenderElement({
    as,
    defaultTag: `h${level}`,
    render,
    state: {},
    props: {
      ...layoutAttributes("Heading", {
        size,
        weight,
        tone,
        leading,
        align,
        measure,
        wrap,
        responsive,
      }),
      ...consumerProps,
    },
  });
}
Heading.displayName = "Heading";
