import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/drawer.css"), "utf8").replace(
  /\s+/g,
  " ",
);

describe("Drawer skin: physical sides", () => {
  it.each(["left", "right"])("does not push the %s drawer trigger wrapper off-center", (side) => {
    const root = document.createElement("div");
    root.setAttribute("data-uiify-drawer", "");
    root.setAttribute("data-part", "root");
    root.setAttribute("data-side", side);
    const sideMarginRules = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)].filter(
      ([, selector, declarations]) =>
        selector?.trim().startsWith("[data-uiify-drawer]") &&
        selector.includes(`[data-side="${side}"]`) &&
        /margin-inline-(start|end): auto/.test(declarations ?? ""),
    );
    expect(sideMarginRules.length).toBeGreaterThan(0);
    for (const [, selector] of sideMarginRules) {
      expect(root.matches(selector!.trim())).toBe(false);
      root.setAttribute("data-part", "content");
      expect(root.matches(selector!.trim())).toBe(true);
      root.setAttribute("data-part", "root");
    }
  });

  it("keeps side=right on the physical right in RTL", () => {
    expect(css).toMatch(
      /:dir\(rtl\) \[data-uiify-drawer\]\[data-part="content"\]\[data-side="right"\] \{[^}]*margin-inline: 0 auto;/,
    );
  });

  it("keeps side=left on the physical left in RTL", () => {
    expect(css).toMatch(
      /:dir\(rtl\) \[data-uiify-drawer\]\[data-part="content"\]\[data-side="left"\] \{[^}]*margin-inline: auto 0;/,
    );
  });
});
