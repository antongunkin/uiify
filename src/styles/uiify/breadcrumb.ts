import { defineRecipe } from "../define.js";

export const breadcrumb = defineRecipe("breadcrumb", {
  parts: ["list", "item", "link", "page", "separator", "ellipsis", "ellipsis-content"],
  base: {
    root: "",
    list: "flex flex-wrap items-center gap-2 list-none p-0 m-0",
    item: "flex items-center gap-2",
    link: "text-primary no-underline hover:underline",
    // The current page, same look as the old current link.
    page: "text-foreground font-semibold",
    // A list item between items (shadcn shape), so it takes the list gap like an item.
    separator: "flex items-center text-muted-foreground",
    ellipsis: "",
    "ellipsis-content": "list-none m-0 p-0",
  },
});
