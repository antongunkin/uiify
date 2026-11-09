import { defineRecipe } from "../define.js";

type CarouselPart =
  | "viewport"
  | "status"
  | "control"
  | "dots"
  | "dot"
  | "slide"
  | "slide-content"
  | "story"
  | "story-topline"
  | "story-body"
  | "story-eyebrow"
  | "story-heading"
  | "story-text";

export const carousel = defineRecipe<Record<string, never>, CarouselPart>("carousel", {
  parts: [
    "viewport",
    "status",
    "control",
    "dots",
    "dot",
    "slide",
    "slide-content",
    "story",
    "story-topline",
    "story-body",
    "story-eyebrow",
    "story-heading",
    "story-text",
  ],
  requires: ["button"],
  base: {
    root: "relative grid content-start items-center gap-2 inline-full",
    viewport: "col-span-full",
    status: "col-span-full",
    control:
      "data-[carousel-action=rotation]:col-span-full data-[carousel-action=rotation]:justify-self-start data-[carousel-action=rotation]:mbe-2 data-[carousel-action=previous]:text-2xl data-[carousel-action=next]:text-2xl data-[carousel-action=previous]:leading-none data-[carousel-action=next]:leading-none",
    dots: "col-start-2 justify-self-stretch flex justify-center gap-1",
    dot: "inline-grid size-10 place-items-center rounded-full bg-transparent text-muted-foreground no-underline transition-colors focus-visible:outline-2 focus-visible:outline-ring outline-offset-2 after:size-2 after:rounded-full after:bg-input aria-[current=true]:after:bg-primary",
    slide: "min-w-0 min-h-0 snap-start snap-always",
    "slide-content":
      "flex min-block-72 aspect-square items-center justify-center border border-border rounded-2xl bg-card text-foreground text-4xl font-semibold leading-none shadow-popover",
    story: "grid w-full h-full min-w-0 min-h-0 p-6 text-start",
    "story-topline":
      "flex items-center justify-between flex-wrap gap-2 text-muted-foreground text-xs leading-none font-medium",
    "story-body": "grid content-center gap-3 min-w-0 py-4",
    "story-eyebrow": "text-primary text-xs leading-none font-semibold",
    "story-heading": "m-0 text-foreground text-3xl font-semibold leading-tight whitespace-pre-line",
    "story-text": "m-0 text-muted-foreground text-sm",
  },
});
