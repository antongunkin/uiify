import { defineRecipe } from "../define.js";

export const alertDialog = defineRecipe("alert-dialog", {
  parts: ["trigger", "content", "title", "description", "footer", "action", "cancel"],
  requires: ["dialog", "button"],
  base: {
    root: "",
    trigger: "",
    content:
      "m-auto inline-112 max-inline-full p-6 border border-border rounded-xl bg-popover text-popover-foreground shadow-modal gap-3 hidden open:grid",
    title: "m-0 text-xl font-semibold",
    description: "mbs-2 mbe-4 text-sm leading-normal text-muted-foreground",
    footer: "flex justify-end gap-2 pbs-3 border-bs border-border",
    action: "",
    cancel: "",
  },
});
