import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeCss } from "./test-css.js";

const sliderCss = readFileSync(
  resolve(import.meta.dirname, "../../dist/styles/uiify/slider.css"),
  "utf8",
);
const sliderClientCss = readFileSync(
  resolve(import.meta.dirname, "../../dist/styles/uiify/slider-client.css"),
  "utf8",
);

describe("Slider recipe effects", () => {
  it("keeps engine-specific native range track and thumb painting", () => {
    expect(normalizeCss(sliderCss)).toContain(
      normalizeCss(".uiify-slider::-webkit-slider-runnable-track"),
    );
    expect(normalizeCss(sliderCss)).toContain(normalizeCss(".uiify-slider::-webkit-slider-thumb"));
    expect(normalizeCss(sliderCss)).toContain(normalizeCss(".uiify-slider::-moz-range-thumb"));
    expect(normalizeCss(sliderCss)).toContain(normalizeCss(".uiify-slider::-moz-range-track"));
    expect(normalizeCss(sliderCss)).toContain(normalizeCss("var(--uiify-slider-progress, 50%)"));
  });

  it("keeps rtl track fill rules separate for each native range engine", () => {
    const uncommented = sliderCss.replace(/\/\*[\s\S]*?\*\//g, "");
    const selectors = [...uncommented.matchAll(/([^{}]+)\{/g)].map((match) => match[1]!.trim());
    for (const selector of selectors) {
      expect(selector.includes("::-webkit-") && selector.includes("::-moz-"), selector).toBe(false);
    }
    expect(
      selectors.filter(
        (selector) => selector === ".uiify-slider:dir(rtl)::-webkit-slider-runnable-track",
      ),
    ).toHaveLength(1);
    expect(
      selectors.filter((selector) => selector === ".uiify-slider:dir(rtl)::-moz-range-track"),
    ).toHaveLength(1);
    expect(uncommented).not.toContain("[dir=");
  });

  it("keeps dynamic client geometry and visible focus feedback", () => {
    const client = normalizeCss(sliderClientCss);
    expect(client).toContain(normalizeCss(".uiify-slider-client .uiify-slider-range"));
    expect(client).toContain(normalizeCss(".uiify-slider-client .uiify-slider-mark::before"));
    expect(client).toContain(
      normalizeCss(".uiify-slider-client:has(> .uiify-slider-thumb:focus-visible)"),
    );
    expect(client).toContain(normalizeCss('[data-orientation="vertical"]'));
    expect(client).toContain(normalizeCss("var(--uiify-slider-middle)"));
  });
});
