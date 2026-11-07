import { defineRecipe } from "../define.js";

export const aspectRatio = defineRecipe("aspect-ratio", {
  parts: ["content"],
  base: { root: "rounded-md bg-muted" },
});
