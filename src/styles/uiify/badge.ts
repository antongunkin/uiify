import type { BadgeSize, BadgeVariant } from "../../components/badge/types.js";
import { defineRecipe } from "../define.js";

export const badge = defineRecipe<{ variant: BadgeVariant; size: BadgeSize }>("badge", {
  base: "inline-flex w-fit items-center rounded-full bg-primary px-2.5 py-1 text-sm leading-tight font-medium text-primary-foreground",
  variants: {
    variant: {
      // `default` renders no `data-variant`; the base styles it with the primary fill, as shadcn/ui does.
      default: "",
      secondary: "bg-foreground/10 text-foreground",
      // An inset ring draws the rim without a border, so outline badges keep the same box size.
      outline: "bg-transparent text-foreground inset-ring inset-ring-border",
      // Status tones are drawn in effects.css: tinted text, a translucent fill and a rim.
      success: "",
      warning: "",
      destructive: "",
    },
    size: {
      sm: "px-2 py-0.5 text-xs leading-tight",
      md: "",
      lg: "px-3 py-1.5 text-base leading-tight",
    },
  },
});
