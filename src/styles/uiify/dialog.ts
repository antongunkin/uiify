import type { DialogSize, DialogBackdrop, DialogAlign } from "../../components/dialog/types.js";
import { defineRecipe } from "../define.js";

const sheet =
  "max-sm:w-full max-sm:max-w-full max-sm:mbs-auto max-sm:mbe-0 max-sm:mx-0 max-sm:border-be-0 max-sm:rounded-es-none max-sm:rounded-ee-none";

/** The dialog itself owns variant axes; the convenience wrapper is uiify-dialog-root. */
export const dialog = defineRecipe<
  { size: DialogSize; backdrop: DialogBackdrop; align: DialogAlign },
  "header" | "title" | "description" | "close" | "body" | "footer" | "grabber"
>("dialog", {
  parts: ["header", "title", "description", "close", "body", "footer", "grabber"],
  requires: ["button"],
  childParts: ["grabber"],
  defaultVariants: { size: "md" },
  base: {
    root: "m-auto w-112 p-6 border border-border rounded-xl bg-popover text-popover-foreground shadow-modal flex-col gap-3 open:flex",
    header: "flex-none pe-10",
    title: "m-0 text-xl font-semibold leading-8",
    description: "mbs-2 mbe-4 text-muted-foreground text-sm leading-normal",
    close: "absolute inset-bs-2.5 end-2.5 grid place-items-center",
    body: "flex-auto min-h-0 overflow-auto overscroll-contain",
    footer: "flex flex-none flex-wrap justify-end gap-2",
    grabber:
      "hidden flex-none h-6 -mbs-3 -mbe-2 after:block after:w-9 after:h-1 after:mbs-2 after:mbe-0 after:mx-auto after:rounded-full after:bg-border",
  },
  variants: {
    size: {
      sm: { root: `w-96 ${sheet}`, grabber: "max-sm:block" },
      md: { root: sheet, grabber: "max-sm:block" },
      lg: { root: `w-160 ${sheet}`, grabber: "max-sm:block" },
      full: "inset-0 m-0 w-full h-full max-w-none max-h-none border-0 rounded-none",
    },
    backdrop: { opaque: "", blur: "backdrop:backdrop-blur-xs", none: "backdrop:bg-transparent" },
    align: { center: "", start: "" },
  },
  compoundVariants: [
    { align: "start", size: "sm", class: "sm:mbs-6 sm:mbe-auto" },
    { align: "start", size: "md", class: "sm:mbs-6 sm:mbe-auto" },
    { align: "start", size: "lg", class: "sm:mbs-6 sm:mbe-auto" },
  ],
});
