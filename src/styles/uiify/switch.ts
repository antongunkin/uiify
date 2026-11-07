import { defineRecipe } from "../define.js";

export const switchRecipe = defineRecipe("switch", {
  base: {
    root: "appearance-none relative w-9 h-5 m-0 flex-none border-0 border-none rounded-full bg-input cursor-pointer transition-colors checked:bg-primary data-[state=checked]:bg-primary disabled:opacity-50 disabled:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  },
});
