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

  it("uses the shared soft focus ring on standalone and grouped inputs", () => {
    expect(css).toMatch(
      /\.uiify-combobox-input:focus-visible \{[^}]*box-shadow: 0 0 0 var\(--ring-width\) color-mix\(in oklch, var\(--ring\) 20%, transparent\);/,
    );
    expect(css).toMatch(
      /\.uiify-combobox-control:focus-within \{[^}]*box-shadow: 0 0 0 var\(--ring-width\) color-mix\(in oklch, var\(--ring\) 20%, transparent\);/,
    );
  });

  it("keeps the control corners at pill radius when tags wrap onto more rows", () => {
    expect(css).toMatch(
      /\.uiify-combobox-control \{[^}]*border-radius: calc\(var\(--uiify-control-size, var\(--control-md\)\) \/ 2\);/,
    );
  });

  it("preserves popup sizing and selected item states", () => {
    expect(css).toContain("max-block-size: min(24rem, calc(100dvb - 2rem))");
    expect(recipe).toContain("data-[selected]:bg-accent");
    expect(css).toContain("prefers-reduced-motion: no-preference");
  });
});
