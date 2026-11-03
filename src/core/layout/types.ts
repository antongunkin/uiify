import type {
  layoutParts,
  layoutConditions,
  spaceValues,
  widthValues,
  heightValues,
  minWidthValues,
  maxWidthValues,
  flexValues,
  overflowValues,
  responsiveValues,
  directionValues,
  alignValues,
  justifyValues,
  columnsValues,
  columnSpanValues,
  trackValues,
  columnStartValues,
  alignSelfValues,
  textSizeValues,
  textWeightValues,
  textToneValues,
  textLeadingValues,
  textAlignValues,
  textMeasureValues,
  textWrapValues,
  headingLevelValues,
} from "./values.js";

export type LayoutPart = (typeof layoutParts)[number];
export type LayoutCondition = (typeof layoutConditions)[number];
export type Responsive<T> = Readonly<Partial<Record<LayoutCondition, T>>>;
export type Space = (typeof spaceValues)[number];
export type LayoutWidth = (typeof widthValues)[number];
export type LayoutHeight = (typeof heightValues)[number];
export type LayoutMinWidth = (typeof minWidthValues)[number];
export type LayoutMaxWidth = (typeof maxWidthValues)[number];
export type LayoutFlex = (typeof flexValues)[number];
export type LayoutOverflow = (typeof overflowValues)[number];
export type ResponsiveBasis = (typeof responsiveValues)[number];
export type StackDirection = (typeof directionValues)[number];
export type LayoutAlign = (typeof alignValues)[number];
export type LayoutJustify = (typeof justifyValues)[number];
export type GridColumns = (typeof columnsValues)[number];
export type GridColumnSpan = (typeof columnSpanValues)[number];
export type GridTrack = (typeof trackValues)[number];
export type GridColumnStart = (typeof columnStartValues)[number];
export type GridAlignSelf = (typeof alignSelfValues)[number];
export type TextSize = (typeof textSizeValues)[number];
export type TextWeight = (typeof textWeightValues)[number];
export type TextTone = (typeof textToneValues)[number];
export type TextLeading = (typeof textLeadingValues)[number];
export type TextAlign = (typeof textAlignValues)[number];
export type TextMeasure = (typeof textMeasureValues)[number];
export type TextWrap = (typeof textWrapValues)[number];
export type HeadingLevel = (typeof headingLevelValues)[number];
