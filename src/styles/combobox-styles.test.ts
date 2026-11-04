import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/combobox.css"), "utf8");

describe("Combobox skin", () => {
  it("styles the control and chip anatomy", () => {
    expect(css).toContain(".ui-cb-control:focus-within");
    expect(css).toContain(".ui-cb-tags");
    expect(css).toContain(".ui-cb-tag");
    expect(css).toContain(".ui-cb-remove");
  });

  it("uses the shared soft focus ring on standalone and grouped inputs", () => {
    expect(css).toMatch(
      /\.ui-cb-input:focus-visible \{[^}]*outline: none;[^}]*box-shadow: 0 0 0 var\(--ring-width\) color-mix\(in oklch, var\(--ring\) 20%, transparent\);/,
    );
    expect(css).toMatch(
      /\.ui-cb-control:focus-within \{[^}]*box-shadow: 0 0 0 var\(--ring-width\) color-mix\(in oklch, var\(--ring\) 20%, transparent\);/,
    );
  });

  it("keeps the control corners at pill radius when tags wrap onto more rows", () => {
    expect(css).toMatch(
      /\.ui-cb-control \{[^}]*border-radius: calc\(var\(--uiify-control-size, var\(--control-md\)\) \/ 2\);/,
    );
  });

  it("aligns popup and selected item states with the menu skin", () => {
    expect(css).toContain("max-block-size: min(24rem, calc(100dvb - 2rem))");
    expect(css).toContain(".ui-cb-item[data-selected]");
    expect(css).toContain("prefers-reduced-motion: no-preference");
  });
});
