import type { ControlSize } from "../../components/internal/control-size/types.js";
import { defineRecipe } from "../define.js";

export const inputGroup = defineRecipe<{ size: ControlSize }, "addon">("input-group", {
  parts: ["addon"],
  childParts: ["addon"],
  requires: ["button", "input"],
  base: {
    root: "flex items-center gap-2 box-border w-full max-w-field min-w-0 min-h-control-md px-control-x border border-input rounded-control bg-card text-foreground text-control leading-normal transition-colors",
    addon: "flex items-center min-w-0 max-w-1/2 text-muted-foreground wrap-anywhere",
  },
  variants: {
    size: {
      sm: { root: "min-h-control-sm text-control-sm" },
      md: { root: "min-h-control-md text-control" },
      lg: { root: "min-h-control-lg text-control-lg" },
    },
  },
});
