import { defineRecipe } from "../define.js";

export const accordion = defineRecipe("accordion", {
  parts: ["item", "trigger", "content"],
  base: {
    root: "inline-full border border-border rounded-2xl overflow-hidden",
    item: "border-be border-border last:border-be-0",
    trigger:
      "flex items-center justify-between gap-3 p-4 text-sm leading-normal font-medium cursor-pointer list-none hover:bg-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent",
    content: "pbe-4 px-4 text-sm leading-normal text-muted-foreground",
  },
});
