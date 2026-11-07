import { defineRecipe } from "../define.js";

export const collapsible = defineRecipe("collapsible", {
  parts: ["trigger", "panel"],
  base: {
    root: "inline-full overflow-hidden rounded-xl border border-border",
    trigger:
      "flex items-center justify-between gap-3 p-4 text-sm leading-normal font-medium cursor-pointer list-none hover:bg-secondary focus-visible:outline-none focus-visible:inset-ring-3 focus-visible:inset-ring-ring/20",
    panel: "pbs-0 pbe-4 px-4 text-muted-foreground text-sm leading-normal",
  },
});
