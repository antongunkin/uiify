import { describe, expect, it } from "vitest";
import { defineRecipe, defineStyle } from "./define.js";

type Variant = "secondary" | "ghost";

describe("recipe format", () => {
  it("defineRecipe returns name and config unchanged", () => {
    const config = {
      base: "inline-flex",
      variants: { variant: { secondary: "bg-secondary", ghost: "bg-transparent" } },
    } as const;
    const recipe = defineRecipe<{ variant: Variant }>("button", config);
    expect(recipe.name).toBe("button");
    expect(recipe.base).toBe(config.base);
    expect(recipe.variants).toBe(config.variants);
  });

  it("defineStyle rejects duplicate recipe names", () => {
    const button = defineRecipe("button", { base: "inline-flex" });
    expect(() => defineStyle("uiify", [button, button])).toThrow('Duplicate recipe "button"');
  });

  it("defineStyle rejects requires of an unknown recipe", () => {
    const button = defineRecipe("button", { base: "inline-flex" });
    const modal = defineRecipe("dialog", { base: "grid", requires: ["buton"] });
    expect(() => defineStyle("uiify", [button, modal])).toThrow(
      'Recipe "dialog" requires unknown "buton"',
    );
  });

  it("defineStyle keeps recipes in order", () => {
    const button = defineRecipe("button", { base: "inline-flex" });
    const modal = defineRecipe("dialog", { base: "grid", requires: ["button"] });
    expect(defineStyle("uiify", [button, modal])).toEqual({
      name: "uiify",
      recipes: [button, modal],
    });
  });

  it("requires every value of a typed variant axis", () => {
    defineRecipe<{ variant: Variant }>("button", {
      base: "inline-flex",
      // @ts-expect-error -- `ghost` is missing.
      variants: { variant: { secondary: "bg-secondary" } },
    });
    defineRecipe<Record<never, string>, "title">("dialog", {
      parts: ["title"],
      // @ts-expect-error -- `body` is not a declared part.
      base: { root: "grid", body: "p-4" },
    });
    expect(true).toBe(true);
  });
});
