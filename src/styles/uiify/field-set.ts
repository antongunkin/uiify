import { defineRecipe } from "../define.js";

export const fieldSet = defineRecipe("field-set", {
  parts: ["legend"],
  base: {
    root: "grid gap-3 min-w-0 m-0 p-0 border-0",
    // A rendered legend sits outside the fieldset's grid, so the root's gap never reaches it: the
    // legend keeps its own block-end margin. `variant="label"` matches FieldLabel: its size and
    // Field's label-to-control gap.
    legend:
      "p-0 mbe-3 text-foreground font-medium data-[variant=label]:mbe-2 data-[variant=label]:text-sm",
  },
});
