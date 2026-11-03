import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type {
  Responsive,
  Space,
  LayoutWidth,
  LayoutHeight,
  LayoutMinWidth,
  LayoutMaxWidth,
  LayoutFlex,
  LayoutOverflow,
  ResponsiveBasis,
  StackDirection,
  LayoutAlign,
  LayoutJustify,
  GridColumns,
  GridColumnSpan,
  GridTrack,
  GridColumnStart,
  GridAlignSelf,
} from "../../core/layout/index.js";
export type {
  Responsive,
  Space,
  LayoutWidth,
  LayoutHeight,
  LayoutMinWidth,
  LayoutMaxWidth,
  LayoutFlex,
  LayoutOverflow,
  ResponsiveBasis,
  StackDirection,
  LayoutAlign,
  LayoutJustify,
  GridColumns,
  GridColumnSpan,
  GridTrack,
  GridColumnStart,
  GridAlignSelf,
} from "../../core/layout/index.js";

export interface CommonGeometryProps {
  readonly children?: ReactNode;
  readonly padding?: Space | Responsive<Space>;
  readonly paddingInline?: Space | Responsive<Space>;
  readonly paddingBlock?: Space | Responsive<Space>;
  readonly width?: LayoutWidth | Responsive<LayoutWidth>;
  readonly height?: LayoutHeight | Responsive<LayoutHeight>;
  readonly minWidth?: LayoutMinWidth | Responsive<LayoutMinWidth>;
  readonly maxWidth?: LayoutMaxWidth | Responsive<LayoutMaxWidth>;
  readonly grow?: LayoutFlex | Responsive<LayoutFlex>;
  readonly shrink?: LayoutFlex | Responsive<LayoutFlex>;
  readonly overflow?: LayoutOverflow | Responsive<LayoutOverflow>;
  readonly container?: boolean;
  readonly responsive?: ResponsiveBasis;
}
export interface BoxOwnProps extends CommonGeometryProps {}
export interface SectionOwnProps extends CommonGeometryProps {}
export interface StackOwnProps extends CommonGeometryProps {
  readonly direction?: StackDirection | Responsive<StackDirection>;
  readonly gap?: Space | Responsive<Space>;
  readonly align?: LayoutAlign | Responsive<LayoutAlign>;
  readonly justify?: LayoutJustify | Responsive<LayoutJustify>;
  readonly wrap?: boolean | Responsive<boolean>;
}
export interface GridOwnProps extends CommonGeometryProps {
  readonly columns?: GridColumns | Responsive<GridColumns>;
  readonly gap?: Space | Responsive<Space>;
  readonly rowGap?: Space | Responsive<Space>;
  readonly align?: LayoutAlign | Responsive<LayoutAlign>;
  readonly justify?: LayoutJustify | Responsive<LayoutJustify>;
}
export interface GridItemOwnProps extends CommonGeometryProps {
  readonly columnSpan?: GridColumnSpan | Responsive<GridColumnSpan>;
  readonly rowSpan?: GridTrack | Responsive<GridTrack>;
  readonly columnStart?: GridColumnStart | Responsive<GridColumnStart>;
  readonly alignSelf?: GridAlignSelf | Responsive<GridAlignSelf>;
}
export type BoxProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  BoxOwnProps,
  Record<string, never>,
  HTMLElement
>;
export type SectionProps<TAs extends ElementType = "section"> = RenderableProps<
  TAs,
  SectionOwnProps,
  Record<string, never>,
  HTMLElement
>;
export type StackProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  StackOwnProps,
  Record<string, never>,
  HTMLElement
>;
export type GridProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  GridOwnProps,
  Record<string, never>,
  HTMLElement
>;
export type GridItemProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  GridItemOwnProps,
  Record<string, never>,
  HTMLElement
>;
