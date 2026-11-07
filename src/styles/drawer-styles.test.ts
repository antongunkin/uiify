import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "uiify/effects.css"), "utf8").replace(
  /\s+/g,
  " ",
);

describe("Drawer skin: physical sides", () => {
  it.each(["left", "right"])("does not push the %s drawer trigger wrapper off-center", (side) => {
    const root = document.createElement("div");
    root.className = "uiify-drawer-root";
    root.setAttribute("data-side", side);
    const sideMarginRules = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)].filter(
      ([, selector, declarations]) =>
        selector?.trim().startsWith(".uiify-drawer-content") &&
        selector.includes(`[data-side="${side}"]`) &&
        /margin-inline-(start|end): auto/.test(declarations ?? ""),
    );
    expect(sideMarginRules.length).toBeGreaterThan(0);
    for (const [, selector] of sideMarginRules) {
      expect(root.matches(selector!.trim())).toBe(false);
      root.className = "uiify-drawer uiify-drawer-content";
      expect(root.matches(selector!.trim())).toBe(true);
      root.className = "uiify-drawer-root";
    }
  });

  it("keeps side=right on the physical right in RTL", () => {
    expect(css).toMatch(
      /\.uiify-drawer-content\[data-side="right"\]:dir\(rtl\) \{[^}]*margin-inline: 0 auto;/,
    );
  });

  it("keeps side=left on the physical left in RTL", () => {
    expect(css).toMatch(
      /\.uiify-drawer-content\[data-side="left"\]:dir\(rtl\) \{[^}]*margin-inline: auto 0;/,
    );
  });
});
