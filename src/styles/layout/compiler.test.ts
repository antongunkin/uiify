import { describe, expect, it } from "vitest";
import {
  layoutDeclarations,
  layoutDefaultDeclarations,
  resolveLayoutDeclarations,
} from "./declarations.js";
import { layoutTailwindClasses, layoutTailwindManifest } from "./tailwind.js";

describe("one layout declaration compiler", () => {
  it("normalizes padding overlaps at each condition and keeps later shorthand resets", () => {
    const result = resolveLayoutDeclarations("Box", {
      padding: { base: "md", md: "lg" },
      paddingInline: "xs",
    });
    expect(result.base["padding-inline-start"]).toBe("var(--space-xs)");
    expect(result.base["padding-block-start"]).toBe("var(--space-md)");
    expect(result.md["padding-inline-start"]).toBe("var(--space-lg)");
    expect(result.md["padding-block-end"]).toBe("var(--space-lg)");
  });
  it("resets capped widths and preserves explicit per-condition maxWidth precedence", () => {
    const result = resolveLayoutDeclarations("Section", {
      width: { base: "sm", md: "full" },
      maxWidth: "lg",
    });
    expect(result.base["max-inline-size"]).toBe("calc(var(--space-xl) * 48)");
    expect(result.md).toMatchObject({
      "inline-size": "100%",
      "max-inline-size": "none",
      "margin-inline-start": "0",
      "margin-inline-end": "0",
    });
    expect(
      resolveLayoutDeclarations("Section", { width: { md: "full" }, maxWidth: { md: "prose" } }).md[
        "max-inline-size"
      ],
    ).toBe("65ch");
  });
  it("keeps grid numeric intrinsic fill, ratios and logical placement in the table", () => {
    expect(layoutDeclarations.Grid.columns?.["3"]?.["grid-template-columns"]).toContain(
      "auto-fill",
    );
    expect(layoutDeclarations.Grid.columns?.["1"]?.["grid-template-columns"]).toBe(
      "minmax(0, 1fr)",
    );
    expect(layoutDeclarations.Grid.columns?.["2:1"]?.["grid-template-columns"]).toBe(
      "minmax(0, 2fr) minmax(0, 1fr)",
    );
    expect(layoutDeclarations.GridItem.columnSpan?.full).toEqual({
      "grid-column-start": "1",
      "grid-column-end": "-1",
    });
    expect(layoutDefaultDeclarations.GridItem).not.toHaveProperty("display");
  });
  it("emits static complete utilities with container or viewport conditions", () => {
    const props = { width: { base: "sm", md: "full" }, padding: "lg", paddingInline: "xs" };
    const classes = layoutTailwindClasses("Box", props).split(" ");
    expect(classes).toContain("@min-[48rem]:[max-inline-size:none]");
    expect(classes).toContain("[padding-inline-start:var(--space-xs)]");
    expect(classes).not.toContain("[padding-inline-start:var(--space-lg)]");
    expect(layoutTailwindClasses("Box", { ...props, responsive: "viewport" })).toContain(
      "min-[48rem]:[inline-size:100%]",
    );
    expect(classes.every((value) => layoutTailwindManifest.includes(value))).toBe(true);
  });
  it("restores control caps on responsive inline transitions in the utilities layer", () => {
    const result = layoutTailwindClasses("Stack", { direction: { md: "inline", lg: "block" } });
    expect(result).toContain("@min-[48rem]:[&>");
    expect(result).toContain(":[max-inline-size:revert-layer]");
    expect(result).toContain("@min-[72rem]:[&>");
    expect(result).toContain(":[max-inline-size:none]");
  });
  it("keeps approved type defaults and semantic-independent responsive appearance in both outputs", () => {
    expect(layoutDefaultDeclarations.Text).toMatchObject({
      "font-size": "var(--text-base)",
      "font-weight": "var(--weight-normal)",
      color: "var(--foreground)",
      "line-height": "var(--leading-normal)",
      "margin-block-start": "0",
      "margin-block-end": "0",
    });
    expect(layoutDefaultDeclarations.Heading).toMatchObject({
      "font-size": "var(--text-xl)",
      "font-weight": "var(--weight-semibold)",
      "line-height": "var(--leading-tight)",
    });
    const result = resolveLayoutDeclarations("Heading", {
      level: 1,
      size: { base: "sm", lg: "2xl" },
      weight: "medium",
      tone: "danger",
      measure: "prose",
      wrap: "balance",
    });
    expect(result.base).toMatchObject({
      "font-size": "var(--text-sm)",
      "font-weight": "var(--weight-medium)",
      color: "var(--destructive)",
      "max-inline-size": "65ch",
      "text-wrap": "balance",
    });
    expect(result.lg["font-size"]).toBe("var(--text-2xl)");
    expect(result.base).not.toHaveProperty("font-family");
    expect(result.base).not.toHaveProperty("letter-spacing");
    expect(layoutTailwindClasses("Heading", { size: { lg: "2xl" } })).toContain(
      "@min-[72rem]:[font-size:var(--text-2xl)]",
    );
  });
});
