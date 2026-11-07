import { defineRecipe } from "../define.js";

export const candleChart = defineRecipe("candle-chart", {
  parts: [
    "caption",
    "readout",
    "readout-time",
    "plot",
    "scroll-viewport",
    "canvas",
    "candles",
    "viewport",
    "time-viewport",
    "time-axis",
    "price-axis",
    "candle",
    "candle-hit",
    "crosshair",
    "crosshair-marker",
    "crosshair-time",
    "crosshair-price",
    "data",
  ],
  requires: ["virtual-scroll"],
  base: {
    root: "relative block inline-full min-block-84 px-3 pbs-4 pbe-2 overflow-clip overscroll-none isolate bg-transparent data-[interactive]:touch-none",
    caption: "absolute z-1 inset-bs-3 start-4 text-muted-foreground text-xs uppercase",
    readout:
      "absolute z-1 inset-bs-3 end-4 flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5 tabular-nums leading-none whitespace-nowrap",
    plot: "relative grid gap-x-3 min-inline-0 min-block-72 overscroll-none",
    "scroll-viewport": "col-start-1 row-span-2 row-start-1 min-inline-0 min-block-72",
    canvas: "grid min-inline-full min-block-full",
    candles: "absolute inset-y-0 end-0 inline-full m-0 py-4 px-2 list-none",
    viewport:
      "relative col-start-1 row-start-1 min-inline-0 min-block-72 overflow-clip overscroll-none",
    "time-viewport": "relative col-start-1 row-start-2 min-inline-0 overflow-clip overscroll-none",
    "time-axis": "relative inset-y-0 min-inline-0 m-0 p-0 list-none",
    "price-axis": "relative col-start-2 row-start-1 min-inline-0 m-0 p-0 list-none",
    candle: "absolute block pointer-events-none list-none",
    "candle-hit":
      "absolute z-1 inset-0 size-full m-0 p-0 border-0 appearance-none bg-transparent text-transparent cursor-crosshair focus-visible:outline-2 focus-visible:outline-current focus-visible:-outline-offset-2",
    crosshair: "absolute z-3 inset-0 block-full pointer-events-none",
    "crosshair-marker": "absolute text-base leading-none",
    data: "sr-only",
  },
});

export const virtualScroll = defineRecipe("virtual-scroll", {
  // Windowing and scroll geometry belong to behavior.css, including for headless consumers.
  base: "",
});
