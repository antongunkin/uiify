import { defineRecipe } from "../define.js";

/**
 * PricingPlans block. Layout and text come from Section, Stack, Grid, Card and Text; the recipe
 * only resets the two lists (plans and features) so their markers and UA indents do not show.
 */
export const pricingPlans = defineRecipe("pricing-plans", {
  parts: ["list", "item", "features"],
  base: {
    root: "min-w-0",
    list: "m-0 p-0 list-none",
    // One-column grid: the card fills the item, so plan actions line up across a row.
    item: "grid",
    features: "grid gap-2 m-0 p-0 list-none",
  },
});
