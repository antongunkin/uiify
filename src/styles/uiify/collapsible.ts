import { defineRecipe } from "../define.js";

export const collapsible = defineRecipe("collapsible", {
  parts: ["trigger", "panel"],
  base: {
    root: "inline-full overflow-hidden rounded-2xl border border-border",
    trigger:
      "flex items-center justify-between gap-3 p-4 text-sm leading-normal font-medium cursor-pointer list-none hover:bg-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
    panel: "pbs-0 pbe-4 px-4 text-muted-foreground text-sm leading-normal",
  },
});
