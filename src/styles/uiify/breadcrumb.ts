import { defineRecipe } from "../define.js";

export const breadcrumb = defineRecipe("breadcrumb", {
  parts: ["list", "item", "link", "separator", "ellipsis", "ellipsis-content"],
  base: {
    root: "",
    list: "flex flex-wrap items-center gap-2 list-none p-0 m-0",
    item: "flex items-center gap-2",
    link: "text-primary no-underline hover:underline data-[current]:text-foreground data-[current]:font-semibold",
    separator: "aria-hidden:text-muted-foreground",
    ellipsis: "",
    "ellipsis-content": "list-none m-0 p-0",
  },
});
