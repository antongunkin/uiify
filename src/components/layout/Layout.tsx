import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { layoutAttributes } from "../../core/layout/index.js";
import type { BoxProps, SectionProps, StackProps, GridProps, GridItemProps } from "./types.js";

export function Box<TAs extends ElementType = "div">(props: BoxProps<TAs>): ReactElement | null {
  const {
    as,
    render,
    padding,
    paddingInline,
    paddingBlock,
    width,
    height,
    minWidth,
    maxWidth,
    grow,
    shrink,
    overflow,
    container,
    responsive,
    ...consumerProps
  } = props as BoxProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    render,
    state: {},
    props: {
      ...layoutAttributes("Box", {
        padding,
        paddingInline,
        paddingBlock,
        width,
        height,
        minWidth,
        maxWidth,
        grow,
        shrink,
        overflow,
        container,
        responsive,
      }),
      ...consumerProps,
    },
  });
}
Box.displayName = "Box";

export function Section<TAs extends ElementType = "section">(
  props: SectionProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    padding,
    paddingInline,
    paddingBlock,
    width,
    height,
    minWidth,
    maxWidth,
    grow,
    shrink,
    overflow,
    container,
    responsive,
    ...consumerProps
  } = props as SectionProps<"section">;
  return useRenderElement({
    as,
    defaultTag: "section",
    render,
    state: {},
    props: {
      ...layoutAttributes("Section", {
        padding,
        paddingInline,
        paddingBlock,
        width,
        height,
        minWidth,
        maxWidth,
        grow,
        shrink,
        overflow,
        container,
        responsive,
      }),
      ...consumerProps,
    },
  });
}
Section.displayName = "Section";

export function Stack<TAs extends ElementType = "div">(
  props: StackProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    padding,
    paddingInline,
    paddingBlock,
    width,
    height,
    minWidth,
    maxWidth,
    grow,
    shrink,
    overflow,
    container,
    responsive,
    direction,
    gap,
    align,
    justify,
    wrap,
    ...consumerProps
  } = props as StackProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    render,
    state: {},
    props: {
      ...layoutAttributes("Stack", {
        padding,
        paddingInline,
        paddingBlock,
        width,
        height,
        minWidth,
        maxWidth,
        grow,
        shrink,
        overflow,
        container,
        responsive,
        direction,
        gap,
        align,
        justify,
        wrap,
      }),
      ...consumerProps,
    },
  });
}
Stack.displayName = "Stack";

export function Grid<TAs extends ElementType = "div">(props: GridProps<TAs>): ReactElement | null {
  const {
    as,
    render,
    padding,
    paddingInline,
    paddingBlock,
    width,
    height,
    minWidth,
    maxWidth,
    grow,
    shrink,
    overflow,
    container,
    responsive,
    columns,
    gap,
    rowGap,
    align,
    justify,
    ...consumerProps
  } = props as GridProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    render,
    state: {},
    props: {
      ...layoutAttributes("Grid", {
        padding,
        paddingInline,
        paddingBlock,
        width,
        height,
        minWidth,
        maxWidth,
        grow,
        shrink,
        overflow,
        container,
        responsive,
        columns,
        gap,
        rowGap,
        align,
        justify,
      }),
      ...consumerProps,
    },
  });
}
Grid.displayName = "Grid";

export function GridItem<TAs extends ElementType = "div">(
  props: GridItemProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    padding,
    paddingInline,
    paddingBlock,
    width,
    height,
    minWidth,
    maxWidth,
    grow,
    shrink,
    overflow,
    container,
    responsive,
    columnSpan,
    rowSpan,
    columnStart,
    alignSelf,
    ...consumerProps
  } = props as GridItemProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    render,
    state: {},
    props: {
      ...layoutAttributes("GridItem", {
        padding,
        paddingInline,
        paddingBlock,
        width,
        height,
        minWidth,
        maxWidth,
        grow,
        shrink,
        overflow,
        container,
        responsive,
        columnSpan,
        rowSpan,
        columnStart,
        alignSelf,
      }),
      ...consumerProps,
    },
  });
}
GridItem.displayName = "GridItem";
