import type { SliderClientOwnProps } from "../../components/slider/types.js";
import { defineRecipe } from "../define.js";

export const slider = defineRecipe("slider", {
  base: "box-border block w-full max-w-88 min-w-56 min-h-10 appearance-none bg-transparent cursor-pointer focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-1 disabled:opacity-50 disabled:cursor-not-allowed data-[disabled]:opacity-55 data-[disabled]:cursor-not-allowed",
});

export const sliderClient = defineRecipe<
  { orientation: NonNullable<SliderClientOwnProps["orientation"]> },
  "thumb" | "track" | "range" | "mark" | "visual-thumb"
>("slider-client", {
  parts: ["thumb", "track", "range", "mark", "visual-thumb"],
  childParts: ["thumb", "track"],
  base: {
    root: "relative grid w-full max-w-88 min-w-56 min-h-10 items-center accent-primary data-[disabled]:opacity-55 data-[disabled]:cursor-not-allowed",
    thumb:
      "absolute inset-0 size-full m-0 accent-primary opacity-0 cursor-pointer disabled:cursor-not-allowed",
    track: "absolute inset-y-1/2 h-1.5 rounded-full bg-muted pointer-events-none -translate-y-1/2",
    range: "absolute inset-y-0 rounded-full bg-primary",
    mark: "absolute z-1 grid justify-items-center gap-1 text-muted-foreground text-xs leading-none text-center",
    "visual-thumb":
      "absolute z-2 size-5 aspect-square border-2 border-background rounded-full bg-primary",
  },
  variants: {
    orientation: {
      horizontal: "",
      vertical: {
        root: "w-12 min-w-12 max-w-none h-56",
      },
    },
  },
  defaultVariants: { orientation: "horizontal" },
});
