import { defineRecipe } from "../define.js";

export const toolbar = defineRecipe("toolbar", {
  parts: ["separator"],
  childParts: ["separator"],
  requires: ["button"],
  base: {
    root: "inline-flex items-center gap-1 p-1 border border-border rounded-full bg-card",
    separator: "flex-none self-stretch w-px mx-3 border-0 bg-border",
  },
});
