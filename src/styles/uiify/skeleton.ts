import { defineRecipe } from "../define.js";

export const skeleton = defineRecipe("skeleton", {
  base: "rounded-sm data-[state=loading]:bg-muted data-[shape=circle]:rounded-full",
});
