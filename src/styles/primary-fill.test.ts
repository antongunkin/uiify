import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { compile } from "@tailwindcss/node";
import { describe, expect, it } from "vitest";

/**
 * The default Button (no `data-variant`) fills with the `primary-fill` alias. The Tailwind adapter
 * maps it to `--color-primary`, so a shadcn project's brand colour reaches UIify's main button the
 * way it reaches shadcn's; UIify's own entry (native styles, the workspace site) keeps the
 * monochrome foreground fill.
 */
const read = (path: string) => readFileSync(resolve(import.meta.dirname, path), "utf8");
const unsetButton = (css: string) =>
  /\.uiify-button:not\(\[data-variant\]\)\{background-color:([^;]+);color:([^;}]+)\}/.exec(css);

describe("default Button fill", () => {
  it("follows the host --primary in the Tailwind adapter", async () => {
    const recipes = read("../../dist/styles/uiify.css");
    expect(unsetButton(recipes)?.slice(1)).toEqual([
      "var(--color-primary)",
      "var(--color-primary-foreground)",
    ]);
    const compiler = await compile(
      `@import "tailwindcss";\n@import "./tailwind.css";\n@import "../../dist/styles/uiify.css";`,
      { base: import.meta.dirname, onDependency() {} },
    );
    expect(compiler.build([])).toMatch(/--color-primary: var\(--primary\);/);
  });

  it("stays monochrome in UIify's own entry", () => {
    expect(unsetButton(read("generated/uiify.css"))?.slice(1)).toEqual([
      "var(--color-foreground)",
      "var(--color-background)",
    ]);
  });
});
