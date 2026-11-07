import { defineRecipe } from "../define.js";

export const colorPicker = defineRecipe("color-picker", {
  requires: ["field", "input", "textarea"],
  parts: ["label", "surface", "control", "native-input"],
  base: {
    root: "grid w-full gap-2",
    label:
      "text-sm font-medium leading-normal text-foreground data-[disabled]:text-muted-foreground data-[disabled]:cursor-not-allowed",
    surface: "relative w-full max-w-96",
    control: "",
    "native-input":
      "absolute inset-0 w-full h-full m-0 opacity-0 z-2 cursor-pointer disabled:cursor-not-allowed",
  },
});
