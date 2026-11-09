import { defineRecipe } from "../define.js";

export const datePicker = defineRecipe("date-picker", {
  base: {
    root: "block w-full min-w-48 max-w-field box-border py-0 px-control-x border border-input rounded-control bg-card text-foreground transition-colors focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 data-[invalid]:border-destructive user-invalid:border-destructive data-[invalid]:focus-visible:outline-destructive disabled:opacity-50 disabled:cursor-not-allowed",
  },
});
