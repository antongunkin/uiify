import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { defineRecipe, defineStyle } from "../define.js";
import { compileStyle, findUnknownClasses } from "./compile.js";
import { testButton, testModal } from "./test-utils.js";

const tailwindEntry = resolve(import.meta.dirname, "entry.css");
const options = { tailwindEntry, effectsCss: "" };

describe("compileStyle", () => {
  it("keeps scoped recipes without effects when another recipe owns effects", async () => {
    const compiled = await compileStyle(
      defineStyle("probe", [
        testButton,
        defineRecipe("input", { base: "block h-10" }),
        defineRecipe("textarea", { base: "block" }),
      ]),
      {
        tailwindEntry,
        effectsCss: '@layer components.uiify { .uiify-button::before { content: ""; } }',
      },
    );
    expect(compiled.scoped).not.toContain("undefined");
    expect(compiled.scoped).toContain("[data-style=probe] .uiify-input");
    expect(compiled.scoped).toContain("[data-style=probe] .uiify-textarea");
  });
  it('throws on unknown class "bg-red-500"', async () => {
    const style = defineStyle("probe", [defineRecipe("chip", { base: "inline-flex bg-red-500" })]);
    await expect(compileStyle(style, options)).rejects.toThrow(
      'Recipe "chip" uses unknown classes: bg-red-500',
    );
  });

  it("throws on arbitrary class with recipe and part in message", async () => {
    const recipe = defineRecipe<Record<never, string>, "title">("card", {
      parts: ["title"],
      base: { root: "grid", title: "px-[13px]" },
    });
    await expect(compileStyle(defineStyle("probe", [recipe]), options)).rejects.toThrow(
      'Recipe "card" base.title: px-[13px] (arbitrary)',
    );
  });

  it("output has no @layer theme and no :root", async () => {
    const compiled = await compileStyle(defineStyle("probe", [testButton, testModal]), options);
    for (const css of [compiled.all, compiled.scoped, ...compiled.perRecipe.values()]) {
      expect(css).not.toMatch(/@layer theme\s*\{/);
      expect(css).not.toMatch(/@layer base\s*\{/);
      expect(css).not.toContain(":root");
      expect(
        css.startsWith(
          "@layer theme,base,components,utilities;@layer components.ui,components.uiify,components.app;",
        ),
      ).toBe(true);
    }
    expect(compiled.all).toContain(".uiify-button");
    expect(compiled.all).toContain("calc(var(--spacing) * 5)");
    expect(compiled.scoped).toContain("[data-style=probe] .uiify-button");
  });

  it("per-recipe css imports required recipes", async () => {
    const compiled = await compileStyle(defineStyle("probe", [testButton, testModal]), options);
    expect(compiled.perRecipe.get("dialog")).toMatch(/components\.app;@import "\.\/button\.css";/);
    expect(compiled.perRecipe.get("dialog")).not.toContain(".uiify-button{");
    expect(compiled.perRecipe.get("button")).not.toContain("@import");
  });

  it("theme holds every adapter theme value, for hosts that do not run Tailwind", async () => {
    const { theme } = await compileStyle(defineStyle("probe", [testButton]), options);
    expect(theme.startsWith("@layer theme{")).toBe(true);
    expect(theme).toContain("--spacing:.25rem");
    expect(theme).toContain("--color-primary:var(--primary)");
    // Radii are Tailwind's own steps, not a scale derived from --radius (M3: the adapter keeps the host theme).
    expect(theme).not.toContain("var(--radius)");
    expect(theme).not.toContain(".uiify-");
    expect(theme).not.toContain("--gray-1:");
  });

  it("assigns effects rules to their recipe", async () => {
    const effectsCss = `@layer components.uiify {
  .uiify-button::before { content: ""; }
  @keyframes uiify-dialog-enter { from { opacity: 0; } }
}`;
    const compiled = await compileStyle(defineStyle("probe", [testButton, testModal]), {
      tailwindEntry,
      effectsCss,
    });
    expect(compiled.perRecipe.get("button")).toContain(".uiify-button:before");
    expect(compiled.perRecipe.get("dialog")).toContain("@keyframes uiify-dialog-enter");
    expect(compiled.perRecipe.get("dialog")).not.toContain(".uiify-button:before");
    expect(compiled.all).toContain(".uiify-button:before");
  });

  it("assigns registered custom properties to their recipe", async () => {
    const spinner = defineRecipe("spinner", { base: "inline-flex" });
    const compiled = await compileStyle(defineStyle("probe", [spinner]), {
      tailwindEntry,
      effectsCss: `@layer components.uiify {
  @property --uiify-spinner-tail { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
  .uiify-spinner::before { animation: uiify-spinner-orbit 1s linear infinite; }
  @keyframes uiify-spinner-orbit { to { rotate: 360deg; } }
}`,
    });
    expect(compiled.perRecipe.get("spinner")).toContain("@property --uiify-spinner-tail");
  });

  it("rejects effects rules owned by no recipe", async () => {
    await expect(
      compileStyle(defineStyle("probe", [testButton]), {
        tailwindEntry,
        effectsCss: "@layer components.uiify { .other { color: red; } }",
      }),
    ).rejects.toThrow('effects.css rule ".other" does not belong to a recipe');
  });
});

describe("findUnknownClasses", () => {
  it("reports palette colors and unknown names, accepts semantic and custom variants", async () => {
    expect(
      await findUnknownClasses(
        ["bg-red-500", "bg-primary", "hover-fine:bg-primary/90", "px-5", "foo-bar"],
        tailwindEntry,
      ),
    ).toEqual(["bg-red-500", "foo-bar"]);
  });
});
