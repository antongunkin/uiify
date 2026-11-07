import { defineRecipe } from "../define.js";

export const combobox = defineRecipe("combobox", {
  parts: [
    "control",
    "tags",
    "tag",
    "tag-remove",
    "input",
    "trigger",
    "content",
    "item",
    "group",
    "group-label",
    "item-content",
    "item-primary",
    "item-secondary",
    "empty",
    "status",
  ],
  base: {
    root: "relative w-full max-w-72",
    control:
      "flex flex-wrap items-center gap-1 w-full box-border py-1 px-2 border border-input bg-card text-foreground transition-colors",
    tags: "contents",
    tag: "inline-flex items-center min-w-0 max-w-full gap-1 py-0 ps-2 pe-1 border border-solid border-border rounded-full bg-secondary text-sm font-medium leading-normal text-secondary-foreground wrap-anywhere",
    "tag-remove":
      "inline-grid place-items-center size-6 flex-none p-0 border-0 rounded-xs bg-transparent text-muted-foreground leading-none cursor-pointer hover:text-foreground focus-visible:text-foreground focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-1",
    input:
      "w-full box-border py-0 px-4 border border-input rounded-full bg-card text-foreground transition-colors focus-visible:border-primary focus-visible:outline-none placeholder:text-muted-foreground",
    trigger: "",
    content:
      "flex-col min-w-48 max-h-96 overscroll-contain p-1 border border-border rounded-lg bg-card text-foreground shadow-popover",
    item: "flex items-center gap-3 w-full py-2 px-3 border-0 rounded-md bg-transparent text-base leading-normal text-start text-inherit cursor-pointer select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground aria-[selected=true]:bg-accent aria-[selected=true]:text-accent-foreground data-[selected]:bg-accent data-[selected]:text-accent-foreground aria-[disabled=true]:opacity-50 aria-[disabled=true]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
    group: "",
    "group-label": "mt-2 mb-1 px-3 text-muted-foreground text-xs leading-normal font-medium",
    "item-content": "flex flex-auto flex-col min-w-0",
    "item-primary": "block font-medium",
    "item-secondary": "block text-muted-foreground text-sm leading-normal",
    empty: "py-2 px-3 text-muted-foreground text-base",
    status: "",
  },
});
