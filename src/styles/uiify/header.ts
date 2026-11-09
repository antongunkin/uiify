import type { HeaderTone } from "../../components/header/types.js";
import { defineRecipe } from "../define.js";

/**
 * The header has no look of its own; placement lives in `behavior.css`. `primary` fills the bar
 * with the brand colour and sets the text colour, which `Text` without `tone` inherits.
 */
export const header = defineRecipe<{ tone: HeaderTone }>("header", {
  base: "",
  variants: {
    tone: {
      // `default` renders no `data-tone`; the header stays transparent.
      default: "",
      primary: "bg-primary text-primary-foreground",
    },
  },
});
