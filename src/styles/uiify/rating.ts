import { defineRecipe } from "../define.js";

export const rating = defineRecipe("rating", {
  parts: ["item", "input", "label"],
  base: {
    root: "inline-flex flex-row-reverse gap-1",
    item: "text-input has-checked:text-primary",
    input: "sr-only",
    label:
      "inline-flex items-center justify-center text-current text-2xl leading-none cursor-pointer transition-colors",
  },
});
