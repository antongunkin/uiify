import type { ControlSize } from "../../components/internal/control-size/types.js";
import { defineRecipe } from "../define.js";

export const input = defineRecipe<{ size: ControlSize }>("input", {
  base: "block w-full max-w-field box-border h-control-md py-0 px-control-x border border-input rounded-control bg-card text-foreground text-control leading-normal transition-colors placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:border-primary unavailable:opacity-50 unavailable:cursor-not-allowed data-[invalid]:border-destructive user-invalid:border-destructive data-[invalid]:focus-visible:outline-destructive",
  variants: {
    size: { sm: "h-control-sm text-control-sm", md: "", lg: "h-control-lg text-control-lg" },
  },
});
