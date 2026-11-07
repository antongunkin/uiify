import { defineRecipe } from "../define.js";

/** Own recipe so the separator also works outside a Field root. */
export const fieldSeparator = defineRecipe<Record<never, string>, "line" | "content">(
  "field-separator",
  {
    parts: ["line", "content"],
    childParts: ["line", "content"],
    base: {
      root: "flex items-center gap-2 inline-full",
      line: "flex-1 m-0 border-0 border-solid border-bs border-border",
      content: "text-center text-muted-foreground text-xs leading-normal",
    },
  },
);
