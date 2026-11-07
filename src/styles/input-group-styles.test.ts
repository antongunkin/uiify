import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { compileStyle } from "./build/compile.js";
import { validateRecipeSyntax } from "./build/validate.js";
import { uiify } from "./uiify/index.js";
import { inputGroup } from "./uiify/input-group.js";

describe("InputGroup recipe delivery", () => {
  it("uses standard utilities and declares Button and Input dependencies", () => {
    expect(validateRecipeSyntax(inputGroup)).toEqual([]);
    expect(inputGroup.requires).toEqual(["button", "input"]);
  });

  it("delivers the composed control geometry and native-child effects", async () => {
    const compiled = await compileStyle(uiify, {
      tailwindEntry: resolve(import.meta.dirname, "build/entry.css"),
      effectsCss: readFileSync(resolve(import.meta.dirname, "uiify/effects.css"), "utf8"),
    });
    const css = compiled.perRecipe.get("input-group")!;

    expect(css).toContain('@import "./button.css"');
    expect(css).toContain('@import "./input.css"');
    expect(css).toContain(".uiify-input-group");
    expect(css).toContain(".uiify-input-group-addon");
    expect(css).toContain("data-invalid");
    expect(css).not.toContain("data-uiify-input-group");
    expect(css).not.toContain('data-part="root"');
  });
});
