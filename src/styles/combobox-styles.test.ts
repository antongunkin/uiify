import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/combobox.css"), "utf8");
const componentIndex = readFileSync(resolve(import.meta.dirname, "components/index.css"), "utf8");

describe("Combobox skin", () => {
  it("styles the control and chip anatomy", () => {
    expect(css).toContain(".uiify-combobox__control:focus-within");
    expect(css).toContain('[data-part="tags"]');
    expect(css).toContain('[data-part="tag"]');
    expect(css).toContain('[data-part="tag-remove"]');
    expect(css).toContain("border: var(--border-width) solid var(--color-border-strong)");
    expect(css).toContain("border-radius: var(--radius-control)");
    expect(css).toContain("background-color: var(--color-surface)");
  });

  it("aligns popup and selected item states with the menu skin", () => {
    expect(css).toContain("max-block-size: min(24rem, calc(100dvb - 2rem))");
    expect(css).toContain("padding: var(--space-xs)");
    expect(css).toContain("border: var(--border-width) solid var(--color-border)");
    expect(css).toContain("border-radius: var(--radius-md)");
    expect(css).toContain("box-shadow: var(--shadow-popover)");
    expect(css).toContain(".uiify-combobox__item[data-selected]");
    expect(css).toContain("prefers-reduced-motion: reduce");
  });

  it("keeps importing the TagsInput skin while the legacy component remains public", () => {
    expect(componentIndex).toContain('@import url("./tags-input.css")');
  });
});
