import { defineRecipe } from "../define.js";

export const fieldSet = defineRecipe("field-set", {
  parts: ["legend"],
  base: {
    root: "grid gap-3 min-w-0 m-0 p-0 border-0",
    // FieldLegend `variant="label"` matches FieldLabel's size; unset or `legend` keeps the base.
    legend: "p-0 text-foreground font-medium data-[variant=label]:text-sm",
  },
});
