import { describe, expect, it } from "vitest";
import { defineRecipe } from "../define.js";
import { recipeToApplyCss } from "./apply-css.js";
import { testButton, testModal } from "./test-utils.js";

/** Rule heads (`selector {` and at-rule preludes) in output order. */
function heads(css: string): string[] {
  return css
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.endsWith("{") || /\{ @apply /.test(line))
    .map((line) => line.replace(/\s*\{.*$/, ""));
}

describe("recipeToApplyCss", () => {
  it("emits base, variants, compound in declaration order", () => {
    expect(heads(recipeToApplyCss(testButton))).toEqual([
      "@layer components.uiify",
      ".uiify-button",
      '.uiify-button[data-variant="primary"], .uiify-button:not([data-variant])',
      '.uiify-button[data-variant="secondary"]',
      '.uiify-button[data-variant="ghost"]',
      '.uiify-button[data-size="sm"]',
      ".uiify-button[data-full-width]",
      '.uiify-button[data-variant="ghost"][data-size="sm"]',
    ]);
    expect(recipeToApplyCss(testButton)).toContain(
      ".uiify-button { @apply inline-flex items-center rounded-full px-5 hover-fine:opacity-90; }",
    );
  });

  it("default variant also matches absent attribute", () => {
    const recipe = defineRecipe<{ size: "sm" | "md" }>("chip", {
      base: "inline-flex",
      variants: { size: { sm: "h-6", md: "h-8" } },
      compoundVariants: [{ size: "md", class: "px-3" }],
      defaultVariants: { size: "md" },
    });
    expect(heads(recipeToApplyCss(recipe))).toEqual([
      "@layer components.uiify",
      ".uiify-chip",
      '.uiify-chip[data-size="sm"]',
      '.uiify-chip[data-size="md"], .uiify-chip:not([data-size])',
      '.uiify-chip[data-size="md"], .uiify-chip:not([data-size])',
    ]);
  });

  it('value "true" maps to presence selector', () => {
    const css = recipeToApplyCss(testButton);
    expect(css).toContain(".uiify-button[data-full-width] { @apply w-full; }");
    expect(css).not.toContain('data-full-width="true"');
  });

  it("part rules under a root variant are bounded by nested roots", () => {
    const css = recipeToApplyCss(testModal);
    expect(heads(css)).toEqual([
      "@layer components.uiify",
      ".uiify-dialog",
      ".uiify-dialog-title",
      ".uiify-dialog-body",
      '.uiify-dialog[data-size="sm"]',
      '.uiify-dialog[data-size="sm"] > .uiify-dialog-body',
      '@scope (.uiify-dialog[data-size="sm"]) to (.uiify-dialog)',
      ".uiify-dialog-title",
      '.uiify-dialog[data-size="md"], .uiify-dialog:not([data-size])',
    ]);
  });

  it("child parts under a default variant use the child combinator for each condition", () => {
    const css = recipeToApplyCss({
      ...testModal,
      variants: { size: { sm: {}, md: { body: "gap-6" } } },
    });
    expect(css).toContain(
      '.uiify-dialog[data-size="md"] > .uiify-dialog-body, .uiify-dialog:not([data-size]) > .uiify-dialog-body { @apply gap-6; }',
    );
  });

  it("scope option prefixes every selector", () => {
    const css = recipeToApplyCss(testModal, { scope: '[data-style="uiify"]' });
    expect(heads(css)).toEqual([
      "@layer components.uiify",
      '[data-style="uiify"] .uiify-dialog',
      '[data-style="uiify"] .uiify-dialog-title',
      '[data-style="uiify"] .uiify-dialog-body',
      '[data-style="uiify"] .uiify-dialog[data-size="sm"]',
      '[data-style="uiify"] .uiify-dialog[data-size="sm"] > .uiify-dialog-body',
      '@scope ([data-style="uiify"] .uiify-dialog[data-size="sm"]) to (.uiify-dialog)',
      ".uiify-dialog-title",
      '[data-style="uiify"] .uiify-dialog[data-size="md"], [data-style="uiify"] .uiify-dialog:not([data-size])',
    ]);
  });

  it("layer option selects components.app", () => {
    expect(recipeToApplyCss(testButton, { layer: "app" })).toMatch(/^@layer components\.app \{/);
  });

  it("no selector starts with :where or :is", () => {
    for (const recipe of [testButton, testModal]) {
      for (const head of heads(recipeToApplyCss(recipe))) {
        for (const selector of head.replace(/^@scope \(|\) to \(.*$/g, "").split(",")) {
          expect(selector.trim()).not.toMatch(/^:(where|is)\(/);
        }
      }
    }
  });
});
