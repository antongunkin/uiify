import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { compile } from "@tailwindcss/node";
import { transform } from "lightningcss";
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
  it("every var() in dist/styles/uiify.css is declared by the adapter, the theme or Tailwind's theme", () => {
    const compiled = read("dist/styles/uiify.css");
    const known = new Set([
      ...declared(adapter).keys(),
      ...declared(theme).keys(),
      ...declared(tailwindTheme).keys(),
    ]);
    const referenced = new Set([...compiled.matchAll(/var\((--[\w-]+)/g)].map(([, name]) => name));
    const undeclared = [...referenced].filter(
      (name) => name && !known.has(name) && !/^--(tw|uiify)-/.test(name),
    );
    expect(undeclared).toEqual([]);
    expect(compiled).not.toContain(":root");
  });

  it("the adapter never changes a value of Tailwind's default theme", () => {
    const defaults = declared(tailwindTheme);
    const changed = [...declared(adapter)]
      .filter(([name, value]) => defaults.has(name) && defaults.get(name) !== value)
      .map(([name, value]) => `${name}: ${defaults.get(name)} -> ${value}`);
    expect(changed).toEqual([]);
  });

  it("the shadcn `.dark` class switches the theme's light-dark() values after Lightning CSS", async () => {
    const compiler = await compile(
      `@import "tailwindcss";\n@import "./tailwind.css";\n@import "./generated/uiify.css";`,
      { base: resolve(packageRoot, "src/styles"), onDependency() {} },
    );
    // Safari 16 has no light-dark(), so Lightning CSS rewrites it into --lightningcss-* variables, as
    // Next.js and Vite builds do for their default browser targets.
    const { code: bytes } = transform({
      filename: "host.css",
      code: Buffer.from(compiler.build([])),
      targets: { safari: 16 << 16 },
    });
    const code = bytes.toString();
    expect(code).toContain("--lightningcss-dark");
    const switches = [
      ...code.matchAll(/([^{}]+)\{[^{}]*--lightningcss-dark:\s*initial[^{}]*\}/g),
    ].map(([, selector]) => (selector ?? "").trim());
    expect(
      switches.some((selector) =>
        selector
          .split(",")
          .map((part) => part.trim())
          .includes(".dark"),
      ),
    ).toBe(true);
  });
});
