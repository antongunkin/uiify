import type { SpinnerAlign } from "../../components/spinner/types.js";
import { defineRecipe } from "../define.js";

export const spinner = defineRecipe<{ align: SpinnerAlign }, "label">("spinner", {
  parts: ["label"],
  base: {
    root: "relative inline-flex items-center gap-2 text-primary",
    label: "text-foreground",
  },
  variants: {
    align: {
      center: "mx-auto",
      fixed: "fixed inset-bs-1/2 start-1/2 -translate-1/2",
      absolute: "absolute inset-bs-1/2 start-1/2 -translate-1/2",
    },
  },
});
