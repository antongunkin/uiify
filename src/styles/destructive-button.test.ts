import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

/**
 * M13 D2: the destructive Button is shadcn's nova look in plain Tailwind utilities on standard
 * keys (`bg-destructive/10 text-destructive`, a stronger tint on hover and press), the same in the
 * adapter and UIify's own entry: no alias, no runtime variable and no relative-colour override.
 */
const read = (path: string) => readFileSync(resolve(import.meta.dirname, path), "utf8");
const outputs = {
  adapter: () => read("../../dist/styles/uiify.css"),
  own: () => read("generated/uiify.css"),
};
const destructive = '.uiify-button[data-variant="destructive"]';

/** Declarations of every rule whose selector targets the destructive Button, with its selector. */
function destructiveRules(css: string) {
  const rules: { selector: string; decls: string }[] = [];
  postcss.parse(css).walkRules((rule) => {
    const selector = rule.selector.replace(/=destructive\]/g, '="destructive"]');
    if (!selector.includes(".uiify-button") || !selector.includes('[data-variant="destructive"]'))
      return;
    const decls: string[] = [];
    rule.walkDecls((decl) => {
      decls.push(`${decl.prop}:${decl.value}`);
    });
    rules.push({ selector, decls: decls.join(";") });
  });
  return rules;
}

describe.each(Object.entries(outputs))("destructive Button (%s)", (_, output) => {
  it("tints with the destructive colour like shadcn's nova button", () => {
    const rules = destructiveRules(output());
    const base = rules.filter(({ selector }) => selector === destructive);
    expect(base.map(({ decls }) => decls).join(";")).toMatch(
      /background-color:color-mix\(in \w+, var\(--color-destructive\) 10%, transparent\)/,
    );
    expect(base.map(({ decls }) => decls).join(";")).toContain("color:var(--color-destructive)");
    expect(rules.some(({ decls }) => decls.includes("var(--color-destructive) 20%"))).toBe(true);
  });

  it("has no wash or rim layer and no relative-colour override", () => {
    const rules = destructiveRules(output());
    const layers = rules.filter(({ selector }) => /:(?::)?(?:before|after)/.test(selector));
    expect(layers.length).toBeGreaterThan(0);
    for (const { decls } of layers) expect(decls).toContain("content:none");
    expect(output()).not.toMatch(/--color-destructive-fill|--uiify-button-fill|oklch\(from/);
  });
});
