import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/candle-chart.css"), "utf8");

describe("CandleChart styles", () => {
  it("locks wheel overscroll and native scrolling to the chart surface", () => {
    expect(css).toContain("overflow: clip");
    expect(css).toContain("overflow: auto hidden");
    expect(css).toContain("overscroll-behavior: none");
    expect(css).toContain("direction: rtl");
  });

  it("scales grid spacing and the time axis with the candle canvas", () => {
    expect(css).toContain("10% 100%");
    expect(css).toContain("inline-size: calc(100% * var(--candle-scale))");
    expect(css).toContain("inline-size: 100%");
    expect(css).not.toContain("transform: translateX(calc((1 - var(--candle-pan))");
  });

  it("keeps candles flat and adapts chart chrome to the active color scheme", () => {
    expect(css).toContain("background: transparent");
    expect(css).toContain("color-scheme: light dark");
    expect(css).toContain("color: light-dark(");
    expect(css).not.toContain("box-shadow:");
    expect(css).not.toContain("border-radius:");
  });

  it("keeps candle values in React markup and makes the crosshair neutral", () => {
    expect(css).not.toContain("--candle-open");
    expect(css).not.toContain("--candle-high");
    expect(css).not.toContain("--candle-low");
    expect(css).not.toContain("--candle-close");
    expect(css).not.toContain("--candle-time");
    expect(css).toContain("color: light-dark(oklch(52% 0.01 0deg), oklch(72% 0.01 0deg))");
    expect(css).toContain("inline-size: 100%");
  });
});
