import { defineRecipe } from "../define.js";

export const popover = defineRecipe("popover", {
  parts: ["trigger", "content", "close"],
  requires: ["button"],
  base: {
    root: "",
    trigger: "",
    content:
      "flex-col gap-2 inline-max max-inline-72 p-3 border border-border rounded-2xl bg-popover text-popover-foreground shadow-popover",
    close: "",
  },
});

export const hoverCard = defineRecipe("hover-card", {
  parts: ["content"],
  base: {
    root: "",
    content:
      "flex-col gap-2 inline-max max-inline-72 p-3 border border-border rounded-2xl bg-popover text-popover-foreground shadow-popover",
  },
});

export const tooltip = defineRecipe("tooltip", {
  base: {
    root: "inline-max max-inline-64 py-1 px-2 border-0 rounded-lg bg-foreground text-background text-xs leading-normal shadow-popover",
  },
});
