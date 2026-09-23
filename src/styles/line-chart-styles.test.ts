import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/line-chart.css"), "utf8");

describe("LineChart styles", () => {
  it("draws constant-thickness segments rotated to their slope, with grid-based geometry", () => {
    // Thickness must not depend on slope: a bar rotated by atan2, not a clipped polygon.
    expect(css).not.toContain("clip-path: polygon(");
    expect(css).toContain("inline-size: hypot(var(--line-dx), var(--line-dy));");
    expect(css).toContain("rotate: atan2(var(--line-dy), var(--line-dx));");
    // The slope container needs a definite height: the absolutely inset points list.
    expect(css).toMatch(/\[data-part="points"\] \{\s*container-type: size;/);
    expect(css).toContain("display: block;");
    expect(css).toContain("--line-prev-y");
    expect(css).toContain("linear-gradient(to right");
    expect(css).toContain("inset-inline-start: 100%;");
    expect(css).toContain("var(--line-segment-slot) 100%");
    expect(css).toContain("inset-inline-start: var(--line-prev-x, var(--line-x));");
  });

  it("provides the same scaled scroll canvas as CandleChart", () => {
    expect(css).toContain("overflow: auto hidden");
    expect(css).toContain("direction: rtl");
    expect(css).toContain("inline-size: calc(100% * var(--line-scale))");
  });

  it("uses modern CSS for theme and motion-safe interaction", () => {
    expect(css).toContain("@property --line-y");
    // The chart inherits the page's color-scheme; declaring `inherit` explicitly
    // gets rewritten to `normal` by Lightning CSS in consumer bundlers.
    expect(css).not.toMatch(/^\s*color-scheme:/m);
    expect(css).toContain("light-dark(");
    expect(css).toContain("prefers-reduced-motion");
  });

  it("uses the shared muted text token and filled trend-colored point centers", () => {
    expect(css).toMatch(
      /--line-axis:\s*light-dark\(\s*color-mix\(in oklch, var\(--muted-foreground\) 70%, var\(--foreground\)\),\s*var\(--muted-foreground\)\s*\);/,
    );
    expect(css).toMatch(
      /\[data-part="point"\]::after \{[^}]*border: 0;[^}]*background: currentcolor;/,
    );
    expect(css).toMatch(/> figcaption \{[\s\S]*?color: var\(--line-axis\);/);
  });

  it("keeps values in semantic markup instead of CSS custom properties", () => {
    expect(css).not.toContain("--line-value");
    expect(css).not.toContain("--line-time");
  });
});
