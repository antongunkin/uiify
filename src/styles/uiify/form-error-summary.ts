import { defineRecipe } from "../define.js";

export const formErrorSummary = defineRecipe("form-error-summary", {
  parts: ["title", "list", "item", "link"],
  base: {
    root: "grid w-full max-w-field min-w-0 gap-2 border border-border rounded-lg bg-background p-3 text-foreground text-sm leading-normal text-pretty wrap-anywhere",
    title: "m-0 text-sm font-semibold",
    list: "grid gap-1 m-0 ps-4",
    item: "min-w-0 wrap-anywhere",
    link: "text-destructive underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
  },
});
