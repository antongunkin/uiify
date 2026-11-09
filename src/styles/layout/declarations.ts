import {
  layoutConditions,
  layoutPartProps,
  layoutParts,
  trackValues,
  textSizeValues,
  textWeightValues,
} from "../../core/layout/index.js";
import type { LayoutPart } from "../../core/layout/index.js";
import type {
  CssDeclarations,
  LayoutDeclarationTables,
  LayoutDefaultDeclarations,
  ResolvedLayoutDeclarations,
} from "./types.js";

const spaces = {
  none: "0",
  xs: "var(--spacing)",
  sm: "calc(var(--spacing) * 2)",
  md: "calc(var(--spacing) * 3)",
  lg: "calc(var(--spacing) * 4)",
  xl: "calc(var(--spacing) * 6)",
} as const;
const caps = {
  sm: "calc(var(--spacing) * 120)",
  md: "calc(var(--spacing) * 192)",
  lg: "calc(var(--spacing) * 288)",
} as const;
function propertyValues(
  property: string,
  values: Readonly<Record<string, string>>,
): Record<string, CssDeclarations> {
  return Object.fromEntries(
    Object.entries(values).map(([value, css]) => [value, { [property]: css }]),
  );
}
function paddingValues(axes: readonly string[]): Record<string, CssDeclarations> {
  return Object.fromEntries(
    Object.entries(spaces).map(([value, css]) => [
      value,
      Object.fromEntries(
        axes.flatMap((axis) => [
          [`padding-${axis}-start`, css],
          [`padding-${axis}-end`, css],
        ]),
      ),
    ]),
  );
}
const widths = Object.fromEntries([
  ...Object.entries({ auto: "auto", full: "100%", fit: "fit-content" }).map(([value, css]) => [
    value,
    {
      "inline-size": css,
      "max-inline-size": "none",
      "margin-inline-start": "0",
      "margin-inline-end": "0",
    },
  ]),
  ...Object.entries(caps).map(([value, css]) => [
    value,
    {
      "inline-size": "100%",
      "max-inline-size": css,
      "margin-inline-start": "auto",
      "margin-inline-end": "auto",
    },
  ]),
]);
const common = {
  // Property order is semantic: shorthand precedes axes; container precedes width; width
  // precedes maxWidth.
  // A query container is size-contained, so it has no content width: in a parent that does not
  // stretch it (a centring Stack, a row) it would collapse to 0. It fills the inline axis instead;
  // an explicit width, declared after it, still wins.
  container: {
    true: { "container-type": "inline-size", "inline-size": "100%" },
    false: { "container-type": "normal" },
  },
  padding: paddingValues(["inline", "block"]),
  paddingInline: paddingValues(["inline"]),
  paddingBlock: paddingValues(["block"]),
  width: widths,
  height: propertyValues("block-size", { auto: "auto", full: "100%", screen: "100dvh" }),
  minWidth: propertyValues("min-inline-size", { zero: "0", full: "100%" }),
  maxWidth: propertyValues("max-inline-size", { none: "none", ...caps, prose: "65ch" }),
  grow: propertyValues("flex-grow", { 0: "0", 1: "1" }),
  shrink: propertyValues("flex-shrink", { 0: "0", 1: "1" }),
  overflow: propertyValues("overflow", { visible: "visible", hidden: "hidden", auto: "auto" }),
};
const gaps = Object.fromEntries(
  Object.entries(spaces).map(([value, css]) => [
    value,
    { "row-gap": css, "column-gap": css, "--uiify-layout-gap": css },
  ]),
);
const alignment = propertyValues("align-items", {
  start: "start",
  center: "center",
  end: "end",
  stretch: "stretch",
  baseline: "baseline",
});
const justify = propertyValues("justify-content", {
  start: "start",
  center: "center",
  end: "end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
});
const columns: Record<string, CssDeclarations> = {
  ...Object.fromEntries(
    trackValues.map((n) => [
      String(n),
      {
        "grid-template-columns":
          n === 1
            ? "minmax(0, 1fr)"
            : `repeat(auto-fill, minmax(max(min(100%, calc(var(--spacing) * 48)), (100% - (${n} - 1) * var(--uiify-layout-gap, 0%)) / ${n}), 1fr))`,
      },
    ]),
  ),
  sidebar: { "grid-template-columns": "minmax(0, calc(var(--spacing) * 60)) minmax(0, 1fr)" },
  "sidebar-end": {
    "grid-template-columns": "minmax(0, 1fr) minmax(0, calc(var(--spacing) * 60))",
  },
  ...Object.fromEntries(
    ["2:1", "1:2", "3:2", "2:3"].map((ratio) => [
      ratio,
      {
        "grid-template-columns": ratio
          .split(":")
          .map((n) => `minmax(0, ${n}fr)`)
          .join(" "),
      },
    ]),
  ),
};
/**
 * Tailwind's text scale. Layout CSS works without Tailwind too, so each size reads the host's
 * `--text-*` and falls back to Tailwind's default value.
 */
const tailwindTextSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
} as const satisfies Record<(typeof textSizeValues)[number], string>;
const typography = {
  size: propertyValues(
    "font-size",
    Object.fromEntries(
      textSizeValues.map((size) => [size, `var(--text-${size}, ${tailwindTextSizes[size]})`]),
    ),
  ),
  weight: propertyValues(
    "font-weight",
    Object.fromEntries(textWeightValues.map((weight) => [weight, `var(--weight-${weight})`])),
  ),
  tone: propertyValues("color", {
    default: "var(--foreground)",
    muted: "var(--muted-foreground)",
    primary: "var(--primary)",
    danger: "var(--destructive)",
  }),
  leading: propertyValues("line-height", {
    normal: "var(--leading-normal)",
    tight: "var(--leading-tight)",
  }),
  align: propertyValues("text-align", { start: "start", center: "center", end: "end" }),
  measure: propertyValues("max-inline-size", { none: "none", prose: "65ch" }),
  wrap: propertyValues("text-wrap", { wrap: "wrap", balance: "balance", pretty: "pretty" }),
};
const defaults = {
  "box-sizing": "border-box",
  "min-inline-size": "0",
  "overflow-wrap": "anywhere",
} as const;
export const layoutDefaultDeclarations: LayoutDefaultDeclarations = {
  Box: defaults,
  Section: defaults,
  GridItem: defaults,
  Stack: {
    ...defaults,
    display: "flex",
    "flex-direction": "column",
    "row-gap": "0",
    "column-gap": "0",
  },
  Grid: {
    ...defaults,
    display: "grid",
    "grid-template-columns": "minmax(0, 1fr)",
    "row-gap": "0",
    "column-gap": "0",
  },
  Text: {
    ...defaults,
    "margin-block-start": "0",
    "margin-block-end": "0",
    "font-size": "var(--text-base, 1rem)",
    "font-weight": "var(--weight-normal)",
    "line-height": "var(--leading-normal)",
  },
  Heading: {
    ...defaults,
    "margin-block-start": "0",
    "margin-block-end": "0",
    "font-size": "var(--text-2xl, 1.5rem)",
    "font-weight": "var(--weight-semibold)",
    "line-height": "var(--leading-tight)",
  },
};
export const layoutDeclarations: LayoutDeclarationTables = {
  Box: common,
  Section: common,
  Stack: {
    ...common,
    direction: propertyValues("flex-direction", { block: "column", inline: "row" }),
    gap: gaps,
    align: alignment,
    justify,
    wrap: propertyValues("flex-wrap", { true: "wrap", false: "nowrap" }),
  },
  Grid: {
    ...common,
    columns,
    gap: gaps,
    rowGap: propertyValues("row-gap", spaces),
    align: alignment,
    justify,
  },
  GridItem: {
    ...common,
    columnSpan: {
      ...Object.fromEntries(
        trackValues.map((n) => [
          String(n),
          { "grid-column-start": "auto", "grid-column-end": `span ${n}` },
        ]),
      ),
      full: { "grid-column-start": "1", "grid-column-end": "-1" },
    },
    rowSpan: Object.fromEntries(
      trackValues.map((n) => [
        String(n),
        { "grid-row-start": "auto", "grid-row-end": `span ${n}` },
      ]),
    ),
    columnStart: propertyValues("grid-column-start", {
      auto: "auto",
      ...Object.fromEntries(trackValues.map((n) => [String(n), String(n)])),
    }),
    alignSelf: propertyValues("align-self", {
      auto: "auto",
      start: "start",
      center: "center",
      end: "end",
      stretch: "stretch",
      baseline: "baseline",
    }),
  },
  Text: typography,
  Heading: typography,
};

/** Resolve overlaps within each condition. Later conditions remain independent CSS overrides. */
export function resolveLayoutDeclarations(
  kind: LayoutPart,
  props: Readonly<Record<string, unknown>>,
): ResolvedLayoutDeclarations {
  const result: ResolvedLayoutDeclarations = {
    base: { ...layoutDefaultDeclarations[kind] },
    sm: {},
    md: {},
    lg: {},
  };
  for (const condition of layoutConditions) {
    for (const [prop, values] of Object.entries(layoutDeclarations[kind])) {
      const source = props[prop];
      const value =
        source !== null && typeof source === "object"
          ? (source as Readonly<Record<string, unknown>>)[condition]
          : condition === "base"
            ? source
            : undefined;
      if (value !== undefined) Object.assign(result[condition], values[String(value)]);
    }
  }
  return result;
}

/** A finite collection used by the generated manifest and freshness checker. */
export function layoutDeclarationInputs(): Array<
  readonly [LayoutPart, string, string | number | boolean]
> {
  return layoutParts.flatMap((kind) =>
    Object.entries(layoutPartProps[kind]).flatMap(([prop, values]) =>
      values.map((value: string | number | boolean) => [kind, prop, value] as const),
    ),
  );
}

export const layoutControlSelector =
  ":is(.uiify-input,.uiify-textarea,.uiify-field,.uiify-date-picker,.uiify-input-group,.uiify-file-upload,.uiify-slider)";
