import { defineRecipe } from "../define.js";

export const fileUpload = defineRecipe("file-upload", {
  requires: ["button"],
  parts: ["dropzone", "list", "item", "file-info", "file-size", "remove"],
  base: {
    root: "grid inline-full max-inline-96 gap-3",
    dropzone:
      "flex items-center justify-center min-block-32 p-4 border-2 border-dashed border-input rounded-2xl bg-secondary text-center text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-foreground data-[dragging]:border-primary data-[dragging]:bg-primary/10 data-[dragging]:text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    list: "grid gap-1 m-0 p-0 list-none",
    item: "flex items-center gap-2 px-3 py-2 border border-solid border-border rounded-2xl bg-card text-sm",
    "file-info": "grid min-w-0 flex-1 gap-1 wrap-anywhere",
    "file-size": "text-muted-foreground",
    remove:
      "grid place-items-center flex-none size-8 ms-auto border-0 rounded-full bg-secondary text-2xl text-foreground leading-none cursor-pointer hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
  },
});
