import { defineRecipe } from "../define.js";

export const descriptionList = defineRecipe("description-list", {
  requires: ["surface"],
  parts: ["term", "details"],
  base: {
    root: "grid w-full min-w-0 gap-y-3 gap-x-6 m-0",
    term: "font-medium",
    details: "min-w-0 m-0 wrap-anywhere",
  },
});
