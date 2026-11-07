import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(import.meta.dirname, "../../dist/styles/uiify/candle-chart.css"),
  "utf8",
).replace(/: */g, ": ");

describe("CandleChart styles", () => {
  it("locks wheel overscroll and native scrolling to the chart surface", () => {
    expect(css).toContain("overflow: clip");
    expect(css).toContain("overflow: auto hidden");
    expect(css).toContain("overscroll-behavior: none");
    expect(css).toContain("direction: rtl");
  });

  it("scales grid spacing and the time axis with the candle canvas", () => {
    expect(css).toContain("10% 100%");
    expect(css).toContain("inline-size: calc(100% * var(--uiify-candle-scale))");
    expect(css).toContain("inline-size: 100%");
    expect(css).not.toContain("transform: translateX(calc((1 - var(--uiify-candle-pan))");
  });

  it("adapts chart chrome to the active color scheme", () => {
    expect(css).toContain("color-scheme: light dark");
    expect(css).toContain("color: light-dark(");
  });

  it("keeps candle values in React markup", () => {
    expect(css).not.toContain("--uiify-candle-open");
    expect(css).not.toContain("--uiify-candle-high");
    expect(css).not.toContain("--uiify-candle-low");
    expect(css).not.toContain("--uiify-candle-close");
    expect(css).not.toContain("--uiify-candle-time");
    expect(css).toContain("inline-size: 100%");
  });
});
