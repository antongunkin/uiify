import { defineRecipe } from "../define.js";

export const textarea = defineRecipe("textarea", {
  base: "block w-full max-w-field py-2 px-3 border border-input rounded-lg bg-card text-foreground text-sm pointer-coarse:text-base leading-normal transition-colors placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:border-primary unavailable:opacity-50 unavailable:cursor-not-allowed data-[invalid]:border-destructive user-invalid:border-destructive data-[invalid]:focus-visible:outline-destructive data-[autosize]:field-sizing-content data-[autosize]:resize-none",
});
