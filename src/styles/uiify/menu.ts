import { defineRecipe } from "../define.js";

export const menu = defineRecipe("menu", {
  parts: [
    "trigger",
    "content",
    "sub-trigger",
    "sub-content",
    "item",
    "radio-group",
    "group",
    "label",
    "separator",
    "item-icon",
    "item-indicator",
    "item-text",
    "item-description",
    "shortcut",
  ],
  requires: ["button"],
  base: {
    root: "",
    trigger: "",
    content:
      "flex-col min-inline-48 overscroll-contain p-1 border border-border rounded-lg bg-popover text-popover-foreground shadow-popover",
    "sub-trigger": "",
    "sub-content": "min-inline-44",
    item: "flex items-center gap-3 inline-full py-2 px-3 border-0 rounded-md bg-transparent text-inherit text-sm leading-normal text-start cursor-pointer select-none appearance-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground aria-[disabled=true]:opacity-50 aria-[disabled=true]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[danger]:text-destructive data-[danger]:hover:bg-destructive data-[danger]:hover:text-destructive-foreground data-[danger]:focus-visible:bg-destructive data-[danger]:focus-visible:text-destructive-foreground data-[danger]:data-[highlighted]:bg-destructive data-[danger]:data-[highlighted]:text-destructive-foreground",
    "radio-group": "",
    group: "",
    label: "py-1 px-3 text-muted-foreground text-xs font-semibold",
    separator: "block-px my-1 -mx-1 bg-border",
    "item-icon": "inline-grid place-items-center size-5 flex-none",
    "item-indicator":
      "relative inline-grid place-items-center size-5 flex-none border border-input rounded-xs text-transparent",
    "item-text": "grid flex-1 min-w-0",
    "item-description": "text-muted-foreground text-xs leading-normal",
    shortcut: "ms-auto text-muted-foreground text-xs leading-none whitespace-nowrap",
  },
});

export const dropdownMenuBar = defineRecipe("dropdown-menu-bar", {
  base: {
    root: "inline-flex items-center gap-1 p-1 border border-border rounded-lg bg-background",
  },
});
