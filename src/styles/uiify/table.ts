import { defineRecipe } from "../define.js";

type TablePart =
  | "header"
  | "body"
  | "footer"
  | "row"
  | "head"
  | "row-header"
  | "cell"
  | "caption"
  | "sort-button"
  | "expand-trigger"
  | "expanded-row";

export const table = defineRecipe<
  {
    readonly layout: "auto" | "fixed";
    readonly size: "sm" | "md" | "lg";
    readonly variant: "solid" | "outline" | "ghost";
  },
  TablePart
>("table", {
  parts: [
    "header",
    "body",
    "footer",
    "row",
    "head",
    "row-header",
    "cell",
    "caption",
    "sort-button",
    "expand-trigger",
    "expanded-row",
  ],
  childParts: ["header", "body", "footer", "caption"],
  requires: ["button"],
  base: {
    root: "w-full table-auto border-separate border-spacing-0 bg-card text-card-foreground text-sm leading-normal",
    header: "bg-secondary font-semibold data-[sticky]:sticky data-[sticky]:z-2",
    body: "",
    footer: "bg-secondary font-semibold data-[sticky]:sticky data-[sticky]:z-2",
    row: "hover:bg-secondary data-[selected]:bg-accent data-[sticky]:sticky data-[sticky]:z-2 focus-visible:outline-2 focus-visible:outline-ring -outline-offset-2",
    head: "py-3 px-4 text-start align-middle border-be border-border bg-inherit data-[align=center]:text-center data-[align=end]:text-end data-[sticky]:sticky data-[sticky]:z-1",
    "row-header":
      "py-3 px-4 text-start align-middle border-be border-border bg-inherit data-[align=center]:text-center data-[align=end]:text-end data-[sticky]:sticky data-[sticky]:z-1",
    cell: "py-3 px-4 text-start align-middle border-be border-border bg-inherit data-[align=center]:text-center data-[align=end]:text-end data-[sticky]:sticky data-[sticky]:z-1",
    caption: "py-3 text-start text-muted-foreground",
    "sort-button":
      "inline-flex items-center gap-2 p-0 border-0 bg-transparent text-inherit cursor-pointer focus-visible:outline-2 focus-visible:outline-ring -outline-offset-2",
    "expand-trigger": "focus-visible:outline-2 focus-visible:outline-ring -outline-offset-2",
    "expanded-row": "bg-secondary",
  },
  variants: {
    layout: {
      auto: { root: "table-auto" },
      fixed: { root: "table-fixed" },
    },
    size: {
      sm: {
        head: "py-2 px-3",
        "row-header": "py-2 px-3",
        cell: "py-2 px-3",
      },
      md: {},
      lg: {
        head: "py-4 px-5",
        "row-header": "py-4 px-5",
        cell: "py-4 px-5",
      },
    },
    variant: {
      solid: {},
      // The frame already closes the table, so the last row drops its own bottom rule.
      outline: {
        root: "border border-border",
        body: "last:*:last:*:border-be-0",
        footer: "*:last:*:border-be-0",
      },
      ghost: { root: "bg-transparent" },
    },
  },
  defaultVariants: { layout: "auto", size: "md", variant: "solid" },
});
