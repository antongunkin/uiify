import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/line-chart.css"), "utf8");

describe("LineChart styles", () => {
  it("draws segments with CSS clip-path and grid-based responsive geometry", () => {
    expect(css).toContain("clip-path: polygon(");
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
    expect(css).toContain("color-scheme: inherit;");
    expect(css).toContain("light-dark(");
    expect(css).toContain("prefers-reduced-motion");
  });

  it("uses the shared muted text token and filled trend-colored point centers", () => {
    expect(css).toMatch(
      /--line-axis:\s*light-dark\(\s*color-mix\(in oklch, var\(--color-muted-fg\) 70%, var\(--color-fg\)\),\s*var\(--color-muted-fg\)\s*\);/,
    );
    expect(css).toContain("color-scheme: inherit;");
    expect(css).toMatch(
      /\.line-chart__points > li::after \{[^}]*border: 0;[^}]*background: currentcolor;/,
    );
    expect(css).toMatch(/> figcaption \{[\s\S]*?color: var\(--line-axis\);/);
  });

  it("keeps values in semantic markup instead of CSS custom properties", () => {
    expect(css).not.toContain("--line-value");
    expect(css).not.toContain("--line-time");
  });
});
