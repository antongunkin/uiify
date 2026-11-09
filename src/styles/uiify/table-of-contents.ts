import { defineRecipe } from "../define.js";

const focus = "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2";

export const tableOfContents = defineRecipe("table-of-contents", {
  parts: ["trigger", "rail", "indicator", "content", "list", "link"],
  base: {
    root: "text-foreground",
    trigger: `inline-flex items-center justify-center p-3 border-0 rounded-lg bg-transparent text-inherit cursor-pointer ${focus}`,
    rail: "grid items-center overflow-auto",
    indicator:
      "block rounded-full bg-muted-foreground opacity-50 data-[selected]:bg-foreground data-[selected]:opacity-100",
    content:
      "overflow-auto overscroll-contain p-2 border border-border rounded-2xl bg-popover text-popover-foreground",
    list: "grid",
    link: `block py-2.5 rounded-lg text-muted-foreground no-underline wrap-anywhere text-sm leading-5 data-[selected]:text-foreground data-[selected]:font-semibold hover:bg-accent hover:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground ${focus}`,
  },
});
