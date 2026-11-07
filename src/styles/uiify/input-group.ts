import type { ControlSize } from "../../components/internal/control-size/types.js";
import { defineRecipe } from "../define.js";

export const inputGroup = defineRecipe<{ size: ControlSize }, "addon">("input-group", {
  parts: ["addon"],
  childParts: ["addon"],
  requires: ["button", "input"],
  base: {
    root: "flex items-center gap-2 box-border w-full max-w-96 min-w-0 min-h-10 px-4 border border-input rounded-full bg-card text-foreground text-base leading-normal transition-colors",
    addon: "flex items-center min-w-0 max-w-1/2 text-muted-foreground wrap-anywhere",
  },
  variants: {
    size: {
      sm: { root: "min-h-8 text-sm" },
      md: { root: "min-h-10 text-base" },
      lg: { root: "min-h-12 text-lg" },
    },
  },
});
