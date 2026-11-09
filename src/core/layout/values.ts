/** Finite vocabulary shared by React, document validation and static style compilation. */
export const layoutParts = [
  "Box",
  "Section",
  "Stack",
  "Grid",
  "GridItem",
  "Text",
  "Heading",
] as const;
export const layoutConditions = ["base", "sm", "md", "lg"] as const;
export const layoutBreakpoints = { sm: "30rem", md: "48rem", lg: "72rem" } as const;
export const spaceValues = ["none", "xs", "sm", "md", "lg", "xl"] as const;
export const widthValues = ["auto", "full", "fit", "sm", "md", "lg"] as const;
export const heightValues = ["auto", "full", "screen"] as const;
export const minWidthValues = ["zero", "full"] as const;
export const maxWidthValues = ["none", "sm", "md", "lg", "prose"] as const;
export const flexValues = [0, 1] as const;
export const overflowValues = ["visible", "hidden", "auto"] as const;
export const responsiveValues = ["container", "viewport"] as const;
export const directionValues = ["block", "inline"] as const;
export const alignValues = ["start", "center", "end", "stretch", "baseline"] as const;
export const justifyValues = ["start", "center", "end", "between", "around", "evenly"] as const;
export const booleanValues = [true, false] as const;
export const trackValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export const columnsValues = [
  ...trackValues,
  "sidebar",
  "sidebar-end",
  "2:1",
  "1:2",
  "3:2",
  "2:3",
] as const;
export const columnSpanValues = [...trackValues, "full"] as const;
export const columnStartValues = [...trackValues, "auto"] as const;
export const alignSelfValues = ["auto", ...alignValues] as const;
export const textSizeValues = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
] as const;
export const textWeightValues = ["normal", "medium", "semibold"] as const;
export const textToneValues = ["default", "muted", "primary", "danger"] as const;
export const textLeadingValues = ["normal", "tight"] as const;
export const textAlignValues = ["start", "center", "end"] as const;
export const textMeasureValues = ["none", "prose"] as const;
export const textWrapValues = ["wrap", "balance", "pretty"] as const;
export const headingLevelValues = [1, 2, 3, 4, 5, 6] as const;

const common = {
  padding: spaceValues,
  paddingInline: spaceValues,
  paddingBlock: spaceValues,
  width: widthValues,
  height: heightValues,
  minWidth: minWidthValues,
  maxWidth: maxWidthValues,
  grow: flexValues,
  shrink: flexValues,
  overflow: overflowValues,
  container: booleanValues,
  responsive: responsiveValues,
} as const;
const typography = {
  size: textSizeValues,
  weight: textWeightValues,
  tone: textToneValues,
  leading: textLeadingValues,
  align: textAlignValues,
  measure: textMeasureValues,
  wrap: textWrapValues,
  responsive: responsiveValues,
} as const;
export const layoutPartProps = {
  Box: common,
  Section: common,
  Stack: {
    ...common,
    direction: directionValues,
    gap: spaceValues,
    align: alignValues,
    justify: justifyValues,
    wrap: booleanValues,
  },
  Grid: {
    ...common,
    columns: columnsValues,
    gap: spaceValues,
    rowGap: spaceValues,
    align: alignValues,
    justify: justifyValues,
  },
  GridItem: {
    ...common,
    columnSpan: columnSpanValues,
    rowSpan: trackValues,
    columnStart: columnStartValues,
    alignSelf: alignSelfValues,
  },
  Text: typography,
  Heading: { ...typography, level: headingLevelValues },
} as const;

const commonResponsive = [
  "padding",
  "paddingInline",
  "paddingBlock",
  "width",
  "height",
  "minWidth",
  "maxWidth",
  "grow",
  "shrink",
  "overflow",
] as const;
const typographyResponsive = [
  "size",
  "weight",
  "tone",
  "leading",
  "align",
  "measure",
  "wrap",
] as const;
export const layoutResponsiveProps = {
  Box: commonResponsive,
  Section: commonResponsive,
  Stack: [...commonResponsive, "direction", "gap", "align", "justify", "wrap"],
  Grid: [...commonResponsive, "columns", "gap", "rowGap", "align", "justify"],
  GridItem: [...commonResponsive, "columnSpan", "rowSpan", "columnStart", "alignSelf"],
  Text: typographyResponsive,
  Heading: typographyResponsive,
} as const;
