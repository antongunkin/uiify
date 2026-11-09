import { defineRecipe } from "../define.js";

/** Shared styling for raw surfaces such as native popovers and fixture containers. */
export const surface = defineRecipe("surface", {
  base: "grid inline-max gap-3 border border-border rounded-2xl bg-card text-card-foreground p-6 shadow-popover",
});
