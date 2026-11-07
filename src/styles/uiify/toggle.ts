import { defineRecipe } from "../define.js";

export const toggle = defineRecipe("toggle", {
  parts: ["control"],
  childParts: ["control"],
  base: {
    root: "relative inline-flex",
    control:
      "absolute inset-0 size-full m-0 opacity-0 cursor-pointer unavailable:cursor-not-allowed",
  },
  requires: ["button"],
});
