import { defineRecipe } from "../define.js";

export const checkbox = defineRecipe("checkbox", {
  parts: ["control"],
  base: {
    root: "inline-flex items-center gap-2 cursor-pointer select-none text-foreground text-sm leading-normal has-disabled:opacity-50 has-disabled:cursor-not-allowed",
    control:
      "appearance-none inline-grid size-5 place-content-center m-0 border border-input rounded-xs bg-card cursor-pointer transition-colors checked:border-primary checked:bg-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary indeterminate:border-primary indeterminate:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary disabled:opacity-50 disabled:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  },
});
