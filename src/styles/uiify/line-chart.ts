import { defineRecipe } from "../define.js";

export const lineChart = defineRecipe("line-chart", {
  parts: [
    "plot",
    "scroll-viewport",
    "canvas",
    "viewport",
    "caption",
    "readout",
    "readout-time",
    "points",
    "point",
    "point-hit",
    "crosshair",
    "crosshair-marker",
    "value-axis",
    "value-axis-label",
    "time-viewport",
    "time-axis",
    "time-axis-label",
    "crosshair-time",
    "crosshair-value",
    "data",
  ],
  base: {
    root: "relative block w-full min-h-84 px-3 pt-4 pb-2 overflow-clip overscroll-none isolate bg-transparent",
    plot: "relative grid gap-x-3 min-w-0 min-h-72 overscroll-none",
    "scroll-viewport":
      "col-start-1 row-span-2 row-start-1 min-w-0 min-h-72 overflow-x-auto overflow-y-hidden @container",
    canvas: "grid min-w-full min-h-full",
    viewport:
      "@container relative col-start-1 row-start-1 min-w-0 min-h-72 overflow-clip overscroll-none",
    caption: "absolute z-1 inset-bs-3 start-4 text-xs font-semibold tracking-wide uppercase",
    readout:
      "absolute z-1 inset-bs-3 end-4 flex gap-2.5 items-baseline text-xs tabular-nums leading-none whitespace-nowrap",
    "readout-time": "font-semibold",
    points: "absolute inset-y-4 inset-x-0 block m-0 p-0 list-none",
    point: "absolute min-w-0 list-none",
    "point-hit":
      "absolute z-3 inset-0 size-full m-0 p-0 border-0 appearance-none bg-transparent text-transparent cursor-crosshair focus-visible:outline-2 focus-visible:-outline-offset-2",
    crosshair: "absolute z-4 inset-0 h-full pointer-events-none",
    "crosshair-marker": "absolute text-base leading-none -translate-x-1/2 -translate-y-1/2",
    "value-axis": "relative col-start-2 row-start-1 min-w-0 m-0 p-0 list-none",
    "value-axis-label": "absolute inset-x-0 truncate text-xs tabular-nums leading-none text-end",
    "time-viewport": "relative col-start-1 row-start-2 min-w-0 overflow-clip overscroll-none",
    "time-axis": "relative inset-y-0 min-w-0 m-0 p-0 list-none",
    "time-axis-label": "absolute inset-bs-1.5 text-xs whitespace-nowrap",
    "crosshair-time": "absolute inset-bs-1.5 px-2 py-1 text-xs whitespace-nowrap font-semibold",
    "crosshair-value":
      "absolute inset-x-0 px-2 py-1 truncate text-xs tabular-nums leading-none text-end font-semibold",
    data: "sr-only",
  },
});
