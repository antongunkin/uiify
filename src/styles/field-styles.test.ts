import postcss from "postcss";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { compileStyle } from "./build/compile.js";
import { validateRecipeSyntax } from "./build/validate.js";
import { defineStyle } from "./define.js";
import { field } from "./uiify/field.js";
import { fieldSeparator } from "./uiify/field-separator.js";
import { fieldSet } from "./uiify/field-set.js";
import { input } from "./uiify/input.js";
import { textarea } from "./uiify/textarea.js";

interface ScopedRule {
  readonly root: string;
  readonly limit: string | undefined;
  readonly rule: postcss.Rule;
}

/** Rules inside `@scope (root) to (limit)` blocks, with their scope selectors. */
function scopedRules(css: string): ScopedRule[] {
  const found: ScopedRule[] = [];
  postcss.parse(css).walkAtRules("scope", (atRule) => {
    const match = /^\((.+?)\)(?:\s*to\s*\((.+)\))?$/.exec(atRule.params.trim());
    if (!match) return;
    atRule.walkRules((rule) => {
      found.push({ root: match[1]!, limit: match[2], rule });
    });
  });
  return found;
}

/** `@scope` semantics: an ancestor matches the root and no element up to it matches the limit. */
function inScope(element: Element, root: string, limit: string | undefined): boolean {
  for (let node: Element | null = element; node; node = node.parentElement) {
    if (node !== element && node.matches(root)) return true;
    if (limit && node.matches(limit)) return false;
  }
  return false;
}

const declarations = (rule: postcss.Rule) => {
  const result: Record<string, string> = {};
  rule.walkDecls((declaration) => {
    result[declaration.prop] = declaration.value;
  });
  return result;
};

describe("Field card variant CSS", () => {
  it("uses standard utilities only", () => {
    expect(validateRecipeSyntax(field)).toEqual([]);
  });

  it("stretches the label of a card over the card, and not of a nested plain field", async () => {
    const compiled = await compileStyle(
      defineStyle("probe", [field, input, textarea, fieldSet, fieldSeparator]),
      { tailwindEntry: resolve(import.meta.dirname, "build/entry.css"), effectsCss: "" },
    );
    const css = compiled.perRecipe.get("field")!;
    const overlays = scopedRules(css).filter(
      ({ rule }) =>
        /\.uiify-field-label::?after/.test(rule.selector) &&
        declarations(rule)["position"] === "absolute",
    );
    expect(overlays).toHaveLength(1);
    const [{ root, limit, rule }] = overlays as [ScopedRule];
    expect(declarations(rule)).toMatchObject({ position: "absolute", inset: expect.any(String) });
    expect(declarations(rule)["inset"]).toMatch(/^(0|calc\(var\(--spacing\) \* 0\))$/);

    const host = document.createElement("div");
    host.innerHTML = `
      <div class="uiify-field" data-variant="card" data-orientation="horizontal">
        <input type="radio" id="a" />
        <div class="uiify-field-content">
          <label class="uiify-field-label" for="a" data-testid="card">Card</label>
          <div class="uiify-field" data-orientation="vertical">
            <label class="uiify-field-label" for="b" data-testid="nested">Nested</label>
            <input id="b" />
          </div>
        </div>
      </div>
      <div class="uiify-field"><label class="uiify-field-label" data-testid="plain">Plain</label></div>
    `;
    const label = (id: string) => host.querySelector(`[data-testid="${id}"]`)!;
    expect(inScope(label("card"), root, limit)).toBe(true);
    expect(inScope(label("nested"), root, limit)).toBe(false);
    expect(inScope(label("plain"), root, limit)).toBe(false);

    const card = postcss.parse(css);
    const rootDecls: Record<string, string> = {};
    card.walkRules((candidate) => {
      if (/^\.uiify-field\[data-variant="?card"?\]$/.test(candidate.selector)) {
        Object.assign(rootDecls, declarations(candidate));
      }
    });
    expect(rootDecls).toMatchObject({ position: "relative", cursor: "pointer" });
  });
});
