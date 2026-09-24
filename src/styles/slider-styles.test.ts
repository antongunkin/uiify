import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/slider.css"), "utf8");

describe("Slider skin", () => {
  it("keeps the native range input sized to the client slider track", () => {
    expect(css).toMatch(/\[data-uiify-slider\]\s*{[^}]*box-sizing: border-box/s);
    expect(css).toContain("appearance: none");
    expect(css).toContain("var(--uiify-slider-progress, 50%)");
    expect(css).toMatch(/\[data-uiify-slider\]::-webkit-slider-thumb\s*{/);
    expect(css).toMatch(/\[data-uiify-slider\]::-moz-range-thumb\s*{/);
  });

  it("styles the server-rendered client track, range, marks, and visual thumbs", () => {
    expect(css).toContain('[data-uiify-slider-client] [data-part="track"]');
    expect(css).toContain('[data-uiify-slider-client] [data-part="range"]');
    expect(css).toContain('[data-uiify-slider-client] [data-part="mark"]');
    expect(css).toContain('[data-uiify-slider-client] [data-part="visual-thumb"]');
  });

  it("keeps a visible focus treatment and styles vertical and disabled states", () => {
    expect(css).toContain(":focus-visible");
    expect(css).toContain('[data-uiify-slider-client][data-orientation="vertical"]');
    expect(css).toContain("inset-inline: 0");
    expect(css).toContain("block-size: 0.375rem");
    expect(css).toContain("inset-block-start: var(--uiify-slider-position)");
    expect(css).toContain("inset-inline: calc(50% + 0.8rem) auto");
    expect(css).toContain("translate: 50% 0");
    expect(css).toContain("translate: 50% -50%");
    expect(css).toContain("[data-uiify-slider-client][data-disabled]");
  });
});
