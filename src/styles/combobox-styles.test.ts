import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { combobox } from "./uiify/combobox.js";

const css = readFileSync(resolve(import.meta.dirname, "uiify/effects.css"), "utf8");
const recipe = readFileSync(resolve(import.meta.dirname, "uiify/combobox.ts"), "utf8");

describe("Combobox recipe", () => {
  it("styles the control and chip anatomy with recipe identities", () => {
    expect(css).toContain(".uiify-combobox-control:focus-within");
    expect(recipe).toContain('tags: "contents"');
    expect(recipe).toContain('"tag-remove"');
    expect(combobox.parts).toContain("item");
  });

  it("uses the shared solid focus outline on standalone and grouped inputs", () => {
    expect(css).toMatch(
      /\.uiify-combobox-input:focus-visible \{[^}]*outline: 2px solid var\(--ring\);\s*outline-offset: var\(--ring-offset\);/,
    );
    expect(css).toMatch(
      /\.uiify-combobox-control:focus-within \{[^}]*outline: 2px solid var\(--ring\);\s*outline-offset: var\(--ring-offset\);/,
    );
  });

  it("keeps the control corners at the control radius, at most a pill, when tags wrap onto more rows", () => {
    expect(css).toMatch(
      /\.uiify-combobox-control \{[^}]*border-radius: min\(\s*var\(--uiify-control-radius\),\s*calc\(var\(--uiify-control-size\) \/ 2\)\s*\);/,
    );
  });

  it("preserves popup sizing and selected item states", () => {
    expect(css).toContain("max-block-size: min(24rem, calc(100dvb - 2rem))");
    expect(recipe).toContain("data-[selected]:bg-accent");
    expect(css).toContain("prefers-reduced-motion: no-preference");
  });
});
