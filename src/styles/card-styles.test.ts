import postcss from "postcss";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { compileStyle } from "./build/compile.js";
import { validateRecipeSyntax } from "./build/validate.js";
import { defineStyle } from "./define.js";
import { card } from "./uiify/card.js";

describe("Card CSS", () => {
  it("uses standard utilities only", () => {
    expect(validateRecipeSyntax(card)).toEqual([]);
  });

  it("scopes the sm part rules to a small card and stops at a nested card", async () => {
    const compiled = await compileStyle(defineStyle("probe", [card]), {
      tailwindEntry: resolve(import.meta.dirname, "build/entry.css"),
      effectsCss: "",
    });
    const css = compiled.perRecipe.get("card")!;
    const titleScopes: string[] = [];
    postcss.parse(css).walkAtRules("scope", (scope) => {
      scope.walkRules(/\.uiify-card-title/, () => {
        titleScopes.push(scope.params.replace(/\s+/g, " ").replace(/"/g, ""));
      });
    });
    // The optimizer may drop the attribute value's quotes.
    expect(titleScopes).toEqual(["(.uiify-card[data-size=sm]) to (.uiify-card)"]);

    // No part rule sits under a root variant without @scope (no child combinator).
    postcss.parse(css).walkRules((rule) => {
      expect(rule.selector).not.toMatch(/\[data-size[^\]]*\]\s*>/);
    });
  });
});
