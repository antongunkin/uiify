import type { BadgeSize, BadgeVariant } from "../../components/badge/types.js";
import { defineRecipe } from "../define.js";

export const badge = defineRecipe<{ variant: BadgeVariant; size: BadgeSize }>("badge", {
  base: "inline-flex w-fit items-center rounded-full bg-secondary px-2.5 py-1 text-sm leading-tight font-medium text-secondary-foreground",
  variants: {
    variant: {
      // `default` renders no `data-variant`; the base styles it.
      default: "",
      secondary: "",
      // An inset ring draws the rim without a border, so outline badges keep the same box size.
      outline: "bg-transparent text-foreground inset-ring inset-ring-border",
      success: "text-foreground",
      warning: "text-foreground",
      destructive: "text-foreground",
    },
    size: {
      sm: "px-2 py-0.5 text-xs leading-tight",
      md: "",
      lg: "px-3 py-1.5 text-base leading-tight",
    },
  },
});
