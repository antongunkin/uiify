import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/combobox.css"), "utf8");
const componentIndex = readFileSync(resolve(import.meta.dirname, "components/index.css"), "utf8");

describe("Combobox skin", () => {
  it("styles the control and chip anatomy", () => {
    expect(css).toContain('[data-uiify-combobox] [data-part="control"]:focus-within');
    expect(css).toContain('[data-part="tags"]');
    expect(css).toContain('[data-part="tag"]');
    expect(css).toContain('[data-part="tag-remove"]');
    expect(css).toContain("border: var(--border-width) solid var(--input)");
    expect(css).toContain("border-radius: var(--radius-md)");
    expect(css).toContain("background-color: var(--card)");
  });

  it("aligns popup and selected item states with the menu skin", () => {
    expect(css).toContain("max-block-size: min(24rem, calc(100dvb - 2rem))");
    expect(css).toContain("padding: var(--space-xs)");
    expect(css).toContain("border: var(--border-width) solid var(--border)");
    expect(css).toContain("border-radius: var(--radius-md)");
    expect(css).toContain("box-shadow: var(--shadow-popover)");
    expect(css).toContain('[data-uiify-combobox] [data-part="item"][data-selected]');
    expect(css).toContain("prefers-reduced-motion: reduce");
  });

  it("keeps importing the TagsInput skin while the legacy component remains public", () => {
    expect(componentIndex).toContain('@import url("./tags-input.css")');
  });
});
