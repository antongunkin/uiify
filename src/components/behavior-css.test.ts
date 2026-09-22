import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const behaviorSource = readFileSync(resolve(import.meta.dirname, "behavior.css"), "utf8");
const elementManifest = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../elements/element-manifest.json"), "utf8"),
) as { elements: Record<string, { cssRules: string[] }> };

export function normalizeCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function behaviorLayer(): string {
  const start = behaviorSource.indexOf("@layer ui.behavior {");
  if (start === -1) throw new Error("behavior.css has no behavior layer");
  let depth = 0;
  for (let index = behaviorSource.indexOf("{", start); index < behaviorSource.length; index += 1) {
    if (behaviorSource[index] === "{") depth += 1;
    if (behaviorSource[index] === "}") depth -= 1;
    if (depth === 0) return normalizeCss(behaviorSource.slice(start, index + 1));
  }
  throw new Error("behavior.css has unbalanced braces");
}

describe("behavior.css", () => {
  it("hides closed dialogs even when author CSS sets display", () => {
    expect(behaviorLayer()).toContain("dialog:not([open]) { display: none; }");
  });

  it("positions natively anchored surfaces without optional skins", () => {
    const layer = behaviorLayer();
    expect(layer).toContain(
      '[data-positioning="native"] { position: fixed; inset: auto; margin: 0; position-try-fallbacks: flip-block, flip-inline; }',
    );
    expect(layer).toContain(
      '[data-positioning="native"][data-anchor] { position-anchor: var(--uiify-anchor, attr(data-anchor type(<custom-ident>))); }',
    );
    for (const [side, margin] of Object.entries({
      top: "margin-block-end",
      right: "margin-inline-start",
      bottom: "margin-block-start",
      left: "margin-inline-end",
    })) {
      expect(layer).toContain(
        `[data-positioning="native"][data-side="${side}"] { position-area: ${side}; ${margin}: var(--uiify-anchor-offset, 0); }`,
      );
    }
    expect(layer).toContain(
      '[data-positioning="native"][data-side="bottom"][data-align="start"] { position-area: bottom span-right; justify-self: start; }',
    );
  });

  it("does not put design tokens in the behavior layer", () => {
    expect(behaviorLayer()).not.toMatch(/var\(--(?:space|size|color|radius)-/);
  });

  it("leaves popover motion to optional skins", () => {
    const layer = behaviorLayer();
    expect(layer).not.toContain("[popover] { transition:");
    expect(layer).not.toContain("@starting-style { [popover]:popover-open");
  });

  it("matches the literal element manifest behavior rules", () => {
    const layer = behaviorLayer();
    for (const element of Object.values(elementManifest.elements)) {
      for (const rule of element.cssRules) {
        expect(layer).toContain(normalizeCss(rule));
      }
    }
  });
});
