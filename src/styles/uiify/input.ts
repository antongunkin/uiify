import type { ControlSize } from "../../components/internal/control-size/types.js";
import { defineRecipe } from "../define.js";

export const input = defineRecipe<{ size: ControlSize }>("input", {
  base: "block w-full max-w-96 box-border h-10 py-0 px-4 border border-input rounded-full bg-card text-foreground text-base leading-normal transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:border-primary unavailable:opacity-50 unavailable:cursor-not-allowed data-[invalid]:border-destructive user-invalid:border-destructive data-[invalid]:focus-visible:outline-destructive",
  variants: { size: { sm: "h-8 text-sm", md: "", lg: "h-12 text-lg" } },
});
