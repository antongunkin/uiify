import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(import.meta.dirname, "../../dist/styles/uiify/line-chart.css"),
  "utf8",
).replaceAll(/:\s+|,\s+/g, (separator) => separator.trimEnd());

describe("LineChart styles", () => {
  it("draws constant-thickness segments rotated to their slope, with grid-based geometry", () => {
    expect(css).not.toContain("clip-path:polygon(");
    expect(css).toContain("inline-size:hypot(var(--uiify-line-dx),var(--uiify-line-dy))");
    expect(css).toContain("rotate:atan2(var(--uiify-line-dy),var(--uiify-line-dx))");
    // The absolutely inset points list gives its size container a definite height.
    expect(css).toMatch(/\.uiify-line-chart-points\{[^}]*container-type:size/);
    expect(css).toContain("--uiify-line-prev-y");
    expect(css).toContain("var(--uiify-line-segment-slot) 100%");
    expect(css).toContain("inset-inline-start:var(--uiify-line-prev-x,var(--uiify-line-x))");
  });

  it("provides the same scaled scroll canvas as CandleChart", () => {
    expect(css).toMatch(/overflow:(auto hidden|auto clip)|overflow-x:auto/);
    expect(css).toContain("direction:rtl");
    expect(css).toContain("inline-size:calc(100% * var(--uiify-line-scale))");
  });

  it("inherits the color scheme and respects reduced motion", () => {
    expect(css).toContain("@property --uiify-line-y");
    expect(css).not.toMatch(/[;{]color-scheme:/);
    expect(css).toContain("light-dark(");
    expect(css).toContain("prefers-reduced-motion");
  });

  it("keeps values in semantic markup instead of CSS custom properties", () => {
    expect(css).not.toMatch(/--uiify-line-(value|time)[:)]/);
  });
});
