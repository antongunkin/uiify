import { defineRecipe } from "../define.js";

export const checkboxGroup = defineRecipe("checkbox-group", {
  requires: ["checkbox"],
  parts: ["legend"],
  base: {
    root: "flex flex-col flex-wrap gap-2 min-w-0 m-0 p-0 border-0 data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:items-center data-[orientation=horizontal]:gap-3",
    legend: "basis-full mbe-2 p-0 text-foreground font-medium",
  },
});
