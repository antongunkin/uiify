import { describe, expect, it } from "vitest";
import { recipeClasses, recipeToCvaSnippet } from "./snippet.js";
import { testButton, testModal } from "./test-utils.js";

describe("recipeToCvaSnippet", () => {
  it("prints one cva for a single-part recipe", () => {
    expect(recipeToCvaSnippet(testButton)).toBe(`import { cva } from "class-variance-authority";

export const button = cva("inline-flex items-center rounded-full px-5 hover-fine:opacity-90", {
  variants: { variant: { primary: "bg-primary text-primary-foreground", secondary: "bg-secondary text-secondary-foreground", ghost: "bg-transparent" }, size: { sm: "h-8 px-3", md: "" }, fullWidth: { true: "w-full" } },
  compoundVariants: [{ variant: "ghost", size: "sm", class: "px-2" }],
  defaultVariants: { variant: "primary", size: "md" },
});
`);
  });

  it("prints one cva per part with only that part's classes", () => {
    expect(recipeToCvaSnippet(testModal)).toBe(`import { cva } from "class-variance-authority";

export const dialogRoot = cva("grid gap-4", {
  variants: { size: { sm: "max-w-sm", md: "max-w-lg" } },
  defaultVariants: { size: "md" },
});

export const dialogTitle = cva("text-lg font-semibold", {
  variants: { size: { sm: "text-base", md: "" } },
  defaultVariants: { size: "md" },
});

export const dialogBody = cva("text-sm", {
  variants: { size: { sm: "gap-2", md: "" } },
  defaultVariants: { size: "md" },
});
`);
  });
});

describe("recipeClasses", () => {
  it("joins base, selected variants and matching compounds", () => {
    expect(recipeClasses(testButton, "root", { variant: "ghost", size: "sm" })).toBe(
      "inline-flex items-center rounded-full px-5 hover-fine:opacity-90 bg-transparent h-8 px-3 px-2",
    );
  });

  it("falls back to default variants", () => {
    expect(recipeClasses(testButton, "root", {})).toBe(
      "inline-flex items-center rounded-full px-5 hover-fine:opacity-90 bg-primary text-primary-foreground",
    );
  });

  it("returns part classes", () => {
    expect(recipeClasses(testModal, "title", { size: "sm" })).toBe(
      "text-lg font-semibold text-base",
    );
  });
});
