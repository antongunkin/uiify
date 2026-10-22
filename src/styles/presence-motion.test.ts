import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) =>
  readFileSync(resolve(import.meta.dirname, file), "utf8").replace(/\s+/g, " ");

const overlaySkins = ["popup", "surface", "menu", "combobox", "select", "modal"];

describe("shared presence motion", () => {
  it("defines one transition and scale for every appearing surface", () => {
    const semantic = read("tokens/semantic.css");
    expect(semantic).toMatch(/--presence-scale:\s*[^;]+;/);
    expect(semantic).toContain(
      "--transition-presence: opacity var(--duration-fast) var(--ease-out), scale var(--duration-fast) var(--ease-out), display var(--duration-fast) allow-discrete, overlay var(--duration-fast) allow-discrete;",
    );
  });

  it.each(overlaySkins)("%s enters and leaves with the shared transition", (skin) => {
    const css = read(`components/${skin}.css`);
    expect(css).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(css).toContain("transition: var(--transition-presence);");
    expect(css).toContain("@starting-style");
    expect(css).toContain("scale: var(--presence-scale);");
  });

  it("animates toast view transitions with the same presence values", () => {
    const css = read("components/toast.css");
    expect(css).toContain("::view-transition-new(.uiify-toast):only-child");
    expect(css).toContain("::view-transition-old(.uiify-toast):only-child");
    expect(css).toContain(
      "@keyframes uiify-presence-in { from { opacity: 0; scale: var(--presence-scale); } }",
    );
    expect(css).toContain(
      "@keyframes uiify-presence-out { to { opacity: 0; scale: var(--presence-scale); } }",
    );
  });
});
