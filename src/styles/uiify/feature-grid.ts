import { defineRecipe } from "../define.js";

/** FeatureGrid block. Layout and cards come from Section, Grid and Card; the recipe resets the list. */
export const featureGrid = defineRecipe("feature-grid", {
  parts: ["list", "item"],
  base: {
    root: "min-w-0",
    list: "m-0 p-0 list-none",
    // One-column grid: the card fills the item, so cards in a row share a height.
    item: "grid",
  },
});
