import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/menu.css"), "utf8");

describe("DropdownMenu skin", () => {
  it("styles the rich anatomy and native popover states", () => {
    expect(css).toContain('[data-part="item-description"]');
    expect(css).toContain('[data-part="shortcut"]');
    expect(css).toContain("appearance: none");
    expect(css).toContain("text-align: start");
    expect(css).toContain("font-family: inherit");
    expect(css).toContain("1.15rem");
    expect(css).toContain('[role="menuitemradio"][data-state="checked"]');
    expect(css).toContain('data-state="checked"] [data-part="item-indicator"]');
    expect(css).toContain('[data-part="item-indicator"]');
    expect(css).toContain('[data-part="sub-content"]');
    expect(css).toContain(":popover-open");
    expect(css).toContain("@starting-style");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("max-block-size:");
    expect(css).toContain("overflow-y: auto");
    expect(css).toContain("[data-danger]:hover");
    expect(css).toContain('[data-part="shortcut"]');
  });
});
