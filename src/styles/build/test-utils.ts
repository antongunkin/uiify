import { defineRecipe } from "../define.js";

/** Test-only recipes shared by generator tests. */
export const testButton = defineRecipe<{
  variant: "primary" | "secondary" | "ghost";
  size: "sm" | "md";
  fullWidth: "true";
}>("button", {
  base: "inline-flex items-center rounded-full px-5 hover-fine:opacity-90",
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      ghost: "bg-transparent",
    },
    size: { sm: "h-8 px-3", md: "" },
    fullWidth: { true: "w-full" },
  },
  compoundVariants: [{ variant: "ghost", size: "sm", class: "px-2" }],
  defaultVariants: { variant: "primary", size: "md" },
});

export const testModal = defineRecipe<{ size: "sm" | "md" }, "title" | "body">("dialog", {
  parts: ["title", "body"],
  childParts: ["body"],
  base: { root: "grid gap-4", title: "text-lg font-semibold", body: "text-sm" },
  variants: {
    size: { sm: { root: "max-w-sm", title: "text-base", body: "gap-2" }, md: { root: "max-w-lg" } },
  },
  defaultVariants: { size: "md" },
  requires: ["button"],
});
