import { defineRecipe } from "../define.js";

export const toast = defineRecipe("toast", {
  parts: ["viewport", "item", "title", "description", "action", "close"],
  base: {
    root: "",
    viewport:
      "fixed inset-auto inset-be-4 end-4 flex-col gap-2 inline-96 m-0 p-0 border-0 bg-transparent list-none",
    item: "flex flex-col gap-1 py-3 px-4 border border-border rounded-lg bg-popover text-popover-foreground shadow-popover m-0 min-w-0",
    title: "",
    description: "",
    action: "",
    close:
      "self-end min-block-7.5 py-0 px-2 border-0 rounded-md bg-transparent text-popover-foreground cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 hover-fine:bg-accent hover-fine:text-accent-foreground",
  },
});
