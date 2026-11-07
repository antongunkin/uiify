import { defineRecipe } from "../define.js";

export const pagination = defineRecipe("pagination", {
  parts: ["list", "item", "link", "control", "ellipsis"],
  childParts: ["list"],
  requires: ["button"],
  base: {
    list: "flex flex-wrap items-center justify-center gap-1 list-none p-0 m-0",
    item: "grid place-items-center",
    link: "data-[disabled]:cursor-not-allowed",
    ellipsis: "inline-grid place-items-center min-w-10 text-muted-foreground",
  },
});
