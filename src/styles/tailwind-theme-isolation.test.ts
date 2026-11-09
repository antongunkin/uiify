import { readFileSync } from "node:fs";
import { join } from "node:path";
import { compile } from "@tailwindcss/node";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

/**
 * Importing UIify must not change the host app's Tailwind theme: a host utility such as `text-xl`
 * or `ease-out` compiles to the same values with and without the adapter (M3, P2).
 */
const hostUtilities = [
  "p-4",
  "tracking-wide",
  "blur-xs",
  "font-sans",
  "font-mono",
  "font-medium",
  "font-semibold",
  ...["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"].map((size) => `text-${size}`),
  "leading-tight",
  "leading-normal",
  ...["xs", "sm", "md", "lg", "xl", "2xl", "3xl"].map((size) => `rounded-${size}`),
  "ease-out",
  "ease-in-out",
  "transition",
  "transition-colors",
];

const plainHost = `@import "tailwindcss";`;
const uiifyHost = `
@import "tailwindcss";
@import "./tailwind.css";
@import "../../dist/styles/uiify.css";
`;

/** Custom properties Tailwind writes into its own `@layer theme` (not the imported theme file's sublayers). */
function themeValues(css: string) {
  const values = new Map<string, string>();
  postcss.parse(css).walkAtRules("layer", (layer) => {
    if (layer.params.trim() !== "theme" || layer.parent?.type !== "root") return;
    layer.each((node) => {
      if (node.type !== "rule") return;
      node.walkDecls(/^--/, (decl) => {
        values.set(decl.prop, decl.value);
      });
    });
  });
  return values;
}

async function build(entry: string) {
  const compiler = await compile(entry, { base: import.meta.dirname, onDependency() {} });
  return compiler.build(hostUtilities);
}

describe("Tailwind theme isolation", () => {
  it("leaves every Tailwind theme value of the host app unchanged", async () => {
    const plain = themeValues(await build(plainHost));
    const withUiify = themeValues(await build(uiifyHost));

    expect(plain.size).toBeGreaterThan(20);
    const changed = [...plain]
      .filter(([name, value]) => withUiify.get(name) !== value)
      .map(([name, value]) => `${name}: ${value} -> ${withUiify.get(name) ?? "(missing)"}`);
    expect(changed).toEqual([]);
  });

  it("still defines every theme value the compiled recipes read, in a host that uses none of them", async () => {
    const compiler = await compile(uiifyHost, { base: import.meta.dirname, onDependency() {} });
    const css = compiler.build([]);
    const defined = themeValues(css);
    const defaults = themeValues(await build(plainHost));
    const recipes = readFileSync(join(import.meta.dirname, "../../dist/styles/uiify.css"), "utf8");
    const read = new Set([...recipes.matchAll(/var\((--[\w-]+)/g)].map((match) => match[1]!));
    const missing = [...read].filter((name) => defaults.has(name) && !defined.has(name));
    expect(missing).toEqual([]);
  });
});
