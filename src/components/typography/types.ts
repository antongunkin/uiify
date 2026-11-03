import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type {
  Responsive,
  ResponsiveBasis,
  TextSize,
  TextWeight,
  TextTone,
  TextLeading,
  TextAlign,
  TextMeasure,
  TextWrap,
  HeadingLevel,
} from "../../core/layout/index.js";
export type {
  TextSize,
  TextWeight,
  TextTone,
  TextLeading,
  TextAlign,
  TextMeasure,
  TextWrap,
  HeadingLevel,
} from "../../core/layout/index.js";
export interface TextOwnProps {
  readonly children?: ReactNode;
  readonly size?: TextSize | Responsive<TextSize>;
  readonly weight?: TextWeight | Responsive<TextWeight>;
  readonly tone?: TextTone | Responsive<TextTone>;
  readonly leading?: TextLeading | Responsive<TextLeading>;
  readonly align?: TextAlign | Responsive<TextAlign>;
  readonly measure?: TextMeasure | Responsive<TextMeasure>;
  readonly wrap?: TextWrap | Responsive<TextWrap>;
  readonly responsive?: ResponsiveBasis;
}
export interface HeadingOwnProps extends TextOwnProps {
  readonly level?: HeadingLevel;
}
export type TextProps<TAs extends ElementType = "p"> = RenderableProps<
  TAs,
  TextOwnProps,
  Record<string, never>,
  HTMLElement
>;
export type HeadingProps<TAs extends ElementType = "h2"> = RenderableProps<
  TAs,
  HeadingOwnProps,
  Record<string, never>,
  HTMLElement
>;
