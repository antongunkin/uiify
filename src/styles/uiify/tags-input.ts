import { defineRecipe } from "../define.js";

export const tagsInput = defineRecipe("tags-input", {
  parts: ["list", "item", "input-slot", "input", "tag", "tag-remove"],
  base: {
    root: "flex flex-wrap items-center gap-1 inline-full max-inline-96 min-block-10 py-2 px-3 border border-input rounded-lg bg-card text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 focus-within:border-primary",
    list: "flex flex-wrap items-center gap-1 m-0 p-0 list-none",
    item: "inline-flex items-center gap-1 py-1 px-2 rounded-sm bg-accent text-accent-foreground text-xs font-medium",
    "input-slot":
      "inline-flex items-center gap-1 py-1 px-2 rounded-sm bg-accent text-accent-foreground text-xs font-medium",
    input:
      "flex-1 min-inline-20 py-2 px-3 border-0 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
    tag: "inline-flex items-center gap-1 py-1 px-2 rounded-sm bg-accent text-accent-foreground text-xs font-medium",
    "tag-remove": "",
  },
});
