import { defineRecipe } from "../define.js";

export const empty = defineRecipe("empty", {
  parts: ["title", "description", "content"],
  base: {
    root: "grid justify-items-center gap-3 inline-full max-inline-144 mx-auto text-center",
    title: "m-0",
    description: "m-0",
    content: "mbs-1",
  },
});
