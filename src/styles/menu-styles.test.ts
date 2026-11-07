import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeCss } from "./test-css.js";

const css = normalizeCss(
  readFileSync(resolve(import.meta.dirname, "../../dist/styles/uiify/menu.css"), "utf8"),
);

describe("DropdownMenu skin", () => {
  it("styles the rich anatomy and native popover states", () => {
    expect(css).toContain(normalizeCss(".uiify-menu-item-description"));
    expect(css).toContain(normalizeCss(".uiify-menu-shortcut"));
    expect(css).toContain(normalizeCss("appearance: none"));
    expect(css).toContain(normalizeCss("text-align: start"));
    expect(css).toContain(normalizeCss("font-size:"));
    expect(css).toContain(normalizeCss('[role="menuitemradio"][data-state="checked"]'));
    expect(css).toContain(normalizeCss('data-state="checked"] .uiify-menu-item-indicator'));
    expect(css).toContain(normalizeCss(".uiify-menu-item-indicator"));
    expect(css).toContain(normalizeCss(".uiify-menu-sub-content"));
    expect(css).toContain(normalizeCss(":popover-open"));
    expect(css).toContain(normalizeCss("@starting-style"));
    expect(css).toContain(normalizeCss("prefers-reduced-motion: no-preference"));
    expect(css).toContain(normalizeCss("max-block-size:"));
    expect(css).toContain(normalizeCss("overflow-block: auto"));
    expect(css).toContain(normalizeCss("[data-danger]"));
    expect(css).toContain(
      normalizeCss('.uiify-menu-sub-content[data-side="right"] { --uiify-anchor-offset: 0;'),
    );
  });
});
