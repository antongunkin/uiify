import type { SliderClientOwnProps } from "../../components/slider/types.js";
import { defineRecipe } from "../define.js";

/**
 * Shared look of both sliders: an 8px rounded track, the fill in the text colour (`text-*` recolours
 * it) and a 28px thumb on the card colour with a hairline ring. Slider's root draws the track
 * (`before:`) and the round start of the fill (`after:`); the input, inset by the track's radius,
 * paints the rest of the fill from its thumb (`effects.css`) and clips it at its own edge.
 */
const thumb =
  "range-thumb:appearance-none range-thumb:size-7 range-thumb:-mt-2.5 range-thumb:border-0 range-thumb:rounded-full range-thumb:bg-card range-thumb:shadow-sm range-thumb:ring-1 range-thumb:ring-border";

export const slider = defineRecipe<Record<string, never>, "input">("slider", {
  parts: ["input"],
  base: {
    root: [
      "relative isolate flex items-center w-full max-w-field min-w-56 rounded-full text-primary",
      "before:absolute before:-z-1 before:inset-x-0 before:inset-y-1/2 before:h-2 before:-translate-y-1/2 before:rounded-full before:bg-muted",
      "after:absolute after:-z-1 after:start-0 after:inset-y-1/2 after:size-2 after:-translate-y-1/2 after:rounded-full after:bg-current",
      "has-focus-visible:outline-3 has-focus-visible:outline-ring has-focus-visible:outline-offset-2",
      "has-disabled:opacity-50",
    ].join(" "),
    input: [
      "block flex-1 min-w-0 h-8 m-0 mx-1 px-0.5 appearance-none bg-transparent text-current overflow-hidden cursor-pointer outline-none disabled:cursor-not-allowed",
      "range-track:h-2 range-track:bg-transparent range-progress:h-2 range-progress:bg-current",
      thumb,
    ].join(" "),
  },
});

export const sliderClient = defineRecipe<
  { orientation: NonNullable<SliderClientOwnProps["orientation"]> },
  "thumb" | "track" | "range" | "mark" | "visual-thumb"
>("slider-client", {
  parts: ["thumb", "track", "range", "mark", "visual-thumb"],
  childParts: ["thumb", "track"],
  base: {
    root: "relative grid w-full max-w-field min-w-56 min-h-10 items-center rounded-full text-primary has-focus-visible:outline-3 has-focus-visible:outline-ring has-focus-visible:outline-offset-2 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
    // The invisible native inputs get Slider's geometry, so a drag maps to the same place.
    thumb: `absolute inset-y-0 inset-x-1 px-0.5 m-0 appearance-none bg-transparent opacity-0 cursor-pointer disabled:cursor-not-allowed range-track:h-2 ${thumb}`,
    // The track box spans the thumb's travel; its `before:` paints the visible track out to the root.
    track:
      "absolute inset-y-1/2 h-2 pointer-events-none -translate-y-1/2 before:absolute before:-inset-x-5 before:inset-y-0 before:rounded-full before:bg-muted",
    range: "absolute inset-y-0 rounded-full bg-current",
    mark: "absolute z-1 grid justify-items-center gap-1 text-muted-foreground text-xs leading-none text-center",
    "visual-thumb":
      "absolute z-2 size-7 aspect-square rounded-full bg-card shadow-sm ring-1 ring-border",
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
