import { defineRecipe } from "../define.js";

export const item = defineRecipe("item", {
  parts: ["media", "content", "metadata", "actions"],
  requires: ["button"],
  base: {
    root: "grid items-center gap-y-1 gap-x-3.5 min-w-0 py-4 px-3",
    media: "inline-flex col-start-1 row-start-1 row-span-2 flex-none items-center justify-center",
    content: "grid col-start-2 row-start-1 min-w-0 gap-1 wrap-anywhere",
    metadata: "col-start-2 row-start-2 text-muted-foreground text-sm leading-normal",
    actions: "inline-flex col-start-3 row-start-1 row-span-2 items-center justify-self-end gap-2",
  },
});
