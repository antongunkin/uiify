import type { ChoiceOrientation } from "../../components/internal/choice-family/types.js";
import { defineRecipe } from "../define.js";

export const toggleGroup = defineRecipe<
  { orientation: ChoiceOrientation },
  "item" | "control" | "label"
>("toggle-group", {
  parts: ["item", "control", "label"],
  childParts: ["item"],
  base: {
    root: "inline-flex gap-1",
    item: "relative",
    control: "sr-only",
    label: "px-3 data-[size=lg]:px-3",
  },
  variants: {
    orientation: {
      horizontal: "",
      vertical: "flex-col",
    },
  },
  defaultVariants: { orientation: "horizontal" },
  requires: ["button"],
});
