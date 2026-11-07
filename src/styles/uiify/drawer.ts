import { defineRecipe } from "../define.js";

const handle =
  "hidden flex-none block-6 touch-none after:block after:inline-9 after:block-1 after:mbs-2 after:mx-auto after:rounded-full after:bg-border";

export const drawer = defineRecipe("drawer", {
  parts: [
    "trigger",
    "content",
    "close",
    "grabber",
    "handle",
    "header",
    "title",
    "description",
    "body",
    "footer",
  ],
  requires: ["dialog", "button"],
  base: {
    root: "m-0 inline-full max-inline-full p-6 border border-border rounded-s-xl bg-popover text-popover-foreground shadow-modal flex-col gap-3 open:flex",
    close: "inline-grid place-items-center",
    grabber: handle,
    handle,
    header: "flex-none pe-10",
    title: "m-0 text-xl font-semibold leading-7",
    description: "mbs-2 mbe-4 text-sm leading-normal text-muted-foreground",
    body: "min-block-0 overflow-auto overscroll-contain touch-pan-y",
    footer: "flex flex-wrap justify-end gap-2",
  },
});
