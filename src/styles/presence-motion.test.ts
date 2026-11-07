import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) =>
  readFileSync(resolve(import.meta.dirname, file), "utf8").replace(/\s+/g, " ");

const overlaySkins = ["popover", "surface", "menu", "combobox", "native-select", "dialog"];

describe("shared presence motion", () => {
  it("defines one transition and scale for every appearing surface", () => {
    const semantic = read("themes/basic.css");
    expect(semantic).toMatch(/--presence-scale:\s*[^;]+;/);
    expect(semantic).toContain(
      "--transition-presence: opacity var(--duration-fast) var(--ease-out), scale var(--duration-fast) var(--ease-out), display var(--duration-fast) allow-discrete, overlay var(--duration-fast) allow-discrete;",
    );
  });

  it.each(overlaySkins)("%s enters and leaves with the shared transition", (skin) => {
    const css = read(
      skin === "surface" ? "../../dist/styles/uiify/surface.css" : "uiify/effects.css",
    );
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*no-preference\)/);
    expect(css).toMatch(/transition:\s*var\(--transition-presence\)[; }]/);
    expect(css).toContain("@starting-style");
    expect(css).toMatch(/scale:\s*var\(--presence-scale\)[; }]/);
  });

  it("animates toast view transitions with the same presence values", () => {
    const behavior = read("../components/behavior.css");
    const css = read("uiify/effects.css");
    expect(behavior).toContain("::view-transition-new(.uiify-toast):only-child");
    expect(behavior).toContain("::view-transition-old(.uiify-toast):only-child");
    expect(css).toContain(
      "@keyframes uiify-toast-enter { from { opacity: 0; scale: var(--presence-scale); } }",
    );
    expect(css).toContain(
      "@keyframes uiify-toast-exit { to { opacity: 0; scale: var(--presence-scale); } }",
    );
  });
});
