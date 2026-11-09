import { defineRecipe } from "../define.js";

export const progress = defineRecipe("progress", {
  base: "block w-full h-2 appearance-none overflow-hidden rounded-full border-0 bg-muted text-primary",
});
