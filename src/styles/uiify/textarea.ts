import { defineRecipe } from "../define.js";

export const textarea = defineRecipe("textarea", {
  base: "block w-full max-w-96 py-2 px-3 border border-input rounded-md bg-card text-foreground text-sm pointer-coarse:text-base leading-normal transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:border-primary unavailable:opacity-50 unavailable:cursor-not-allowed data-[invalid]:border-destructive user-invalid:border-destructive data-[invalid]:focus-visible:outline-destructive data-[autosize]:field-sizing-content data-[autosize]:resize-none",
});
