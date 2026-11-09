import { defineRecipe } from "../define.js";

export const skeleton = defineRecipe("skeleton", {
  base: "rounded-lg data-[state=loading]:bg-muted data-[shape=circle]:rounded-full",
});
