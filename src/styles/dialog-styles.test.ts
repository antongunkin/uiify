import postcss from "postcss";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { compileStyle } from "./build/compile.js";
import { validateRecipeSyntax } from "./build/validate.js";
import { uiify } from "./uiify/index.js";
import { dialog } from "./uiify/dialog.js";

describe("Dialog recipe delivery", () => {
  it("keeps ordinary grabber styling in the recipe, not effects", () => {
    const effects = postcss.parse(
      readFileSync(resolve(import.meta.dirname, "uiify/effects.css"), "utf8"),
    );
    const properties: string[] = [];
    effects.walkRules(".uiify-dialog-grabber::after", (rule) => {
      rule.walkDecls((declaration) => {
        properties.push(declaration.prop);
      });
    });
    expect(properties).toEqual(["content"]);
  });
  it("uses standard utilities and declares its Button dependency", () => {
    expect(validateRecipeSyntax(dialog)).toEqual([]);
    expect(dialog.requires).toContain("button");
  });

  it("delivers native sheet geometry and discrete transitions in the Dialog CSS", async () => {
    const compiled = await compileStyle(uiify, {
      tailwindEntry: resolve(import.meta.dirname, "build/entry.css"),
      effectsCss: readFileSync(resolve(import.meta.dirname, "uiify/effects.css"), "utf8"),
    });
    const css = compiled.perRecipe.get("dialog")!;
    expect(css).toContain('@import "./button.css"');
    expect(css).toContain("--uiify-sheet-offset");
    expect(css).toContain("env(safe-area-inset-bottom)");
    expect(css).toContain("allow-discrete");
    expect(css).toContain(".uiify-dialog:modal");
    expect(css).not.toContain("data-uiify-dialog");
  });
});
