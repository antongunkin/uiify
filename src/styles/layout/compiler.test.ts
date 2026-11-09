import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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
    expect(result.base["padding-inline-start"]).toBe("var(--spacing)");
    expect(result.base["padding-block-start"]).toBe("calc(var(--spacing) * 3)");
    expect(result.md["padding-inline-start"]).toBe("calc(var(--spacing) * 4)");
    expect(result.md["padding-block-end"]).toBe("calc(var(--spacing) * 4)");
  });
  it("resets capped widths and preserves explicit per-condition maxWidth precedence", () => {
    const result = resolveLayoutDeclarations("Section", {
      width: { base: "sm", md: "full" },
      maxWidth: "lg",
    });
    expect(result.base["max-inline-size"]).toBe("calc(var(--spacing) * 288)");
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
    expect(classes).toContain("[padding-inline-start:var(--spacing)]");
    expect(classes).not.toContain("[padding-inline-start:calc(var(--spacing)_*_4)]");
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
      "font-size": "var(--text-base, 1rem)",
      "font-weight": "var(--weight-normal)",
      "line-height": "var(--leading-normal)",
      "margin-block-start": "0",
      "margin-block-end": "0",
    });
    // Without `tone` the text takes its parent's colour: a Card, an Alert, a primary Header (M11 V5).
    expect(layoutDefaultDeclarations.Text).not.toHaveProperty("color");
    expect(layoutDefaultDeclarations.Heading).not.toHaveProperty("color");
    expect(layoutDefaultDeclarations.Heading).toMatchObject({
      "font-size": "var(--text-2xl, 1.5rem)",
      "font-weight": "var(--weight-semibold)",
      "line-height": "var(--leading-tight)",
    });
    const result = resolveLayoutDeclarations("Heading", {
      level: 1,
      size: { base: "sm", lg: "4xl" },
      weight: "medium",
      tone: "danger",
      measure: "prose",
      wrap: "balance",
    });
    expect(result.base).toMatchObject({
      "font-size": "var(--text-sm, 0.875rem)",
      "font-weight": "var(--weight-medium)",
      color: "var(--destructive)",
      "max-inline-size": "65ch",
      "text-wrap": "balance",
    });
    expect(result.lg["font-size"]).toBe("var(--text-4xl, 2.25rem)");
    expect(result.base).not.toHaveProperty("font-family");
    expect(result.base).not.toHaveProperty("letter-spacing");
    expect(layoutTailwindClasses("Heading", { size: { lg: "4xl" } })).toContain(
      "@min-[72rem]:[font-size:var(--text-4xl,_2.25rem)]",
    );
  });
  it("puts text sizes on Tailwind's scale, read from the host's --text-* (M13 D3)", () => {
    const tailwind = {
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
    } as const;
    for (const [size, value] of Object.entries(tailwind)) {
      expect(
        resolveLayoutDeclarations("Text", { size: size as keyof typeof tailwind }).base[
          "font-size"
        ],
        size,
      ).toBe(`var(--text-${size}, ${value})`);
    }
  });
  it("fills the inline axis of a query container unless width says otherwise", () => {
    // A size-contained box has no content width: in a centring parent it collapsed to 0.
    expect(resolveLayoutDeclarations("Section", { container: true }).base["inline-size"]).toBe(
      "100%",
    );
    expect(
      resolveLayoutDeclarations("Section", { container: true, width: "fit" }).base["inline-size"],
    ).toBe("fit-content");
    expect(layoutTailwindClasses("Box", { container: true }).split(" ")).toContain(
      "[inline-size:100%]",
    );
    expect(layoutTailwindClasses("Box", { container: true, width: "auto" }).split(" ")).toContain(
      "[inline-size:auto]",
    );
    const css = readFileSync(resolve(import.meta.dirname, "../layout.generated.css"), "utf8");
    const containerRule = css.indexOf('[data-container="true"] {');
    expect(css.slice(containerRule, css.indexOf("}", containerRule))).toContain(
      "inline-size: 100%",
    );
    expect(containerRule).toBeLessThan(css.indexOf('[data-width="fit"]'));
  });
});
