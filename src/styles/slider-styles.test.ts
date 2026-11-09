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
  it("draws the track on the root and the fill from the thumb in the text colour", () => {
    const slider = normalizeCss(sliderCss);
    expect(slider).toMatch(/\.uiify-slider:before\{[^}]*background-color:var\(--color-muted\)/);
    expect(slider).toMatch(/\.uiify-slider:after\{[^}]*background-color:currentColor/);
    // The thumb's band follows the native value with no script; the input clips it at its edge.
    expect(slider).toMatch(
      /\.uiify-slider-input::-webkit-slider-thumb\{border-image:linear-gradient\(currentcolor/i,
    );
    expect(slider).toMatch(/\.uiify-slider-input:dir\(rtl\)::-webkit-slider-thumb\{/);
    expect(slider).toMatch(
      /\.uiify-slider-input::-moz-range-progress\{[^}]*background-color:currentColor/,
    );
    expect(slider).toMatch(/\.uiify-slider-input\{[^}]*overflow:hidden/);
    expect(sliderCss).not.toContain("--uiify-slider-progress");
  });

  it("keeps engine-specific thumb rules apart", () => {
    const uncommented = sliderCss.replace(/\/\*[\s\S]*?\*\//g, "");
    const selectors = [...uncommented.matchAll(/([^{}]+)\{/g)].map((match) => match[1]!.trim());
    for (const selector of selectors) {
      expect(selector.includes("::-webkit-") && selector.includes("::-moz-"), selector).toBe(false);
    }
  });

  it("keeps dynamic client geometry with Slider's look", () => {
    const client = normalizeCss(sliderClientCss);
    expect(client).toContain(normalizeCss(".uiify-slider-client .uiify-slider-range"));
    expect(client).toContain(
      normalizeCss(".uiify-slider-client:not([data-range]) .uiify-slider-range"),
    );
    expect(client).toContain(normalizeCss(".uiify-slider-client .uiify-slider-mark::before"));
    expect(client).toContain(normalizeCss('[data-orientation="vertical"]'));
    expect(client).toContain(normalizeCss("var(--uiify-slider-middle)"));
  });
});
