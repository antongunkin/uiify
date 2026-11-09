import { defineRecipe } from "../define.js";

export const tabs = defineRecipe<
  { orientation: "horizontal" | "vertical" },
  "list" | "item" | "control" | "trigger" | "content"
>("tabs", {
  parts: ["list", "item", "control", "trigger", "content"],
  childParts: ["list", "content"],
  base: {
    root: "flex flex-col",
    // The list draws the track; each trigger's 2px edge sits on it (`-mbe-px`), so the selected
    // tab's stripe covers the line instead of floating under the label.
    list: "flex flex-wrap items-end gap-1 border-be border-border",
    item: "contents",
    control: "sr-only",
    // `peer-*` reaches only the label inside the same `uiify-tabs-item` wrapper.
    trigger:
      "inline-flex items-center justify-center min-h-control-md -mbe-px px-3 border-0 border-be-2 border-transparent rounded-ss-lg rounded-se-lg bg-transparent text-muted-foreground text-sm leading-5 font-medium cursor-pointer transition-colors hover-fine:available:bg-foreground/5 hover-fine:available:text-foreground peer-checked/tabs:border-primary peer-checked/tabs:text-foreground peer-focus-visible/tabs:outline-2 peer-focus-visible/tabs:outline-offset-2 peer-focus-visible/tabs:outline-ring data-disabled:opacity-50 data-disabled:cursor-not-allowed",
    content: "w-full min-w-0 pbs-4 text-sm leading-normal",
  },
  variants: {
    orientation: {
      horizontal: {},
      // Vertical tabs keep the track on the inline end, beside the panel.
      vertical: {
        root: "flex-row gap-4",
        list: "flex-col items-stretch border-be-0 border-e",
        trigger:
          "justify-start mbe-0 -me-px border-be-0 border-e-2 rounded-se-none rounded-ss-lg rounded-es-lg",
        content: "pbs-0",
      },
    },
  },
  defaultVariants: { orientation: "horizontal" },
});
