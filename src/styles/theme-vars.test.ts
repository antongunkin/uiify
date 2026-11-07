import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const packageRoot = resolve(import.meta.dirname, "../..");
const read = (path: string) => readFileSync(resolve(packageRoot, path), "utf8");
const adapter = read("src/styles/tailwind.css");
const theme = read("src/styles/themes/basic.css");
const tailwindTheme = readFileSync(
  createRequire(import.meta.url).resolve("tailwindcss/theme.css"),
  "utf8",
);

function declared(css: string): Map<string, string> {
  return new Map(
    [...css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [
      name ?? "",
      (value ?? "").replace(/\s+/g, " ").trim(),
    ]),
  );
}

describe("compiled style theme variables", () => {
  it("every var() in dist/styles/uiify.css is declared by the adapter or the theme", () => {
    const compiled = read("dist/styles/uiify.css");
    const known = new Set([...declared(adapter).keys(), ...declared(theme).keys()]);
    const referenced = new Set([...compiled.matchAll(/var\((--[\w-]+)/g)].map(([, name]) => name));
    const undeclared = [...referenced].filter(
      (name) => name && !known.has(name) && !/^--(tw|uiify)-/.test(name),
    );
    expect(undeclared).toEqual([]);
    expect(compiled).not.toContain(":root");
  });

  it("the adapter re-declares every theme value whose name Tailwind's default theme also uses", () => {
    const adapterValues = declared(adapter);
    const tailwindNames = new Set(declared(tailwindTheme).keys());
    const shared = [...declared(theme)].filter(([name]) => tailwindNames.has(name));
    expect(shared.length).toBeGreaterThan(0);
    for (const [name, value] of shared) expect(adapterValues.get(name), name).toBe(value);
  });
});
