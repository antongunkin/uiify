import type { SeparatorOrientation } from "../../components/separator/types.js";
import { defineRecipe } from "../define.js";

export const separator = defineRecipe<{ orientation: SeparatorOrientation }>("separator", {
  base: "m-0 shrink-0 border-0 border-solid border-border",
  variants: {
    orientation: {
      horizontal: "inline-full border-bs",
      vertical: "self-stretch border-s",
    },
  },
  defaultVariants: { orientation: "horizontal" },
});
