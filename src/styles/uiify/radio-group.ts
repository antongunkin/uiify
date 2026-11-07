import { defineRecipe } from "../define.js";

/** The root hosts Fields or choice cards; outer spacing belongs to the layout. */
export const radioGroup = defineRecipe("radio-group", {
  parts: ["control"],
  base: {
    root: "flex flex-col gap-3 data-[orientation=horizontal]:flex-row",
    control:
      "appearance-none inline-grid size-5 flex-none place-content-center border border-input rounded-full bg-card cursor-pointer transition-colors checked:border-4 checked:border-primary data-[state=checked]:border-4 data-[state=checked]:border-primary disabled:opacity-50 disabled:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  },
});
