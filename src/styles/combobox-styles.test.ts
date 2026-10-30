import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/combobox.css"), "utf8");

describe("Combobox skin", () => {
  it("styles the control and chip anatomy", () => {
    expect(css).toContain('[data-uiify-combobox] [data-part="control"]:focus-within');
    expect(css).toContain('[data-part="tags"]');
    expect(css).toContain('[data-part="tag"]');
    expect(css).toContain('[data-part="tag-remove"]');
  });

  it("keeps the control corners at pill radius when tags wrap onto more rows", () => {
    expect(css).toMatch(
      /\[data-part="control"\] \{[^}]*border-radius: calc\(var\(--uiify-control-size, var\(--control-md\)\) \/ 2\);/,
    );
  });

  it("aligns popup and selected item states with the menu skin", () => {
    expect(css).toContain("max-block-size: min(24rem, calc(100dvb - 2rem))");
    expect(css).toContain('[data-uiify-combobox] [data-part="item"][data-selected]');
    expect(css).toContain("prefers-reduced-motion: no-preference");
  });
});
