import type { ControlSize } from "../../components/internal/control-size/types.js";
import type { ChoiceOrientation } from "../../components/internal/choice-family/types.js";
import { defineRecipe } from "../define.js";

export const segmentedControl = defineRecipe<
  { orientation: ChoiceOrientation; fullWidth: "true"; size: ControlSize },
  "item" | "input" | "label"
>("segmented-control", {
  parts: ["item", "input", "label"],
  childParts: ["item"],
  requires: ["button"],
  base: {
    root: "relative inline-flex box-border items-stretch gap-0 border border-border p-1 rounded-control bg-muted",
    item: "relative grid",
    input: "sr-only",
    label:
      "z-1 min-w-16 peer-checked/segmented-control:border-transparent peer-checked/segmented-control:bg-primary peer-checked/segmented-control:text-primary-foreground peer-focus-visible/segmented-control:outline-2 peer-focus-visible/segmented-control:outline-ring peer-focus-visible/segmented-control:outline-offset-2",
  },
  variants: {
    orientation: {
      horizontal: { label: "min-h-0" },
      vertical: {
        root: "flex-col rounded-2xl",
      },
    },
    fullWidth: {
      true: {
        root: "w-full",
        item: "flex-1",
        label: "w-full",
      },
    },
    size: {
      sm: { label: "text-sm leading-5" },
      md: {},
      lg: { label: "text-control-lg leading-7" },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "md",
  },
  compoundVariants: [
    { orientation: "horizontal", size: "sm", class: { root: "h-control-sm" } },
    { orientation: "horizontal", size: "md", class: { root: "h-control-md" } },
    { orientation: "horizontal", size: "lg", class: { root: "h-control-lg" } },
  ],
});
