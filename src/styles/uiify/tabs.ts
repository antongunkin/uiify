import { defineRecipe } from "../define.js";

export const tabs = defineRecipe<
  { orientation: "horizontal" | "vertical" },
  "list" | "item" | "control" | "trigger" | "content"
>("tabs", {
  parts: ["list", "item", "control", "trigger", "content"],
  childParts: ["list", "content"],
  base: {
    root: "flex flex-col",
    list: "flex flex-wrap items-start",
    item: "contents",
    control: "sr-only",
    // `peer-*` reaches only the label inside the same `uiify-tabs-item` wrapper.
    trigger:
      "inline-flex py-1.5 px-3 border-0 border-b-2 border-transparent bg-transparent text-muted-foreground text-sm leading-5 font-medium cursor-pointer transition-colors hover-fine:available:text-foreground peer-checked/tabs:border-primary peer-checked/tabs:text-foreground peer-focus-visible/tabs:outline-none peer-focus-visible/tabs:ring-2 peer-focus-visible/tabs:ring-ring/20 data-disabled:opacity-50 data-disabled:cursor-not-allowed",
    content: "w-full min-w-0 text-sm leading-normal",
  },
  variants: {
    orientation: {
      horizontal: {},
      vertical: { root: "flex-row gap-4", list: "flex-col" },
    },
  },
  defaultVariants: { orientation: "horizontal" },
});
