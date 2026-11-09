import type { CardSize } from "../../components/card/types.js";
import { defineRecipe } from "../define.js";

/**
 * Padding and gaps live on the root, so a card without parts is a finished surface and parts
 * carry no padding. A CardAction takes grid column 2 beside the title; without one the header
 * keeps a single column. No `childParts`: `sm` part rules go through `@scope`, so they reach
 * parts inside wrappers and stop at a nested card. Title and description reset the UA margin of
 * `as="h2"`/`as="p"`.
 */
export const card = defineRecipe<
  { size: CardSize },
  "header" | "title" | "description" | "action" | "content" | "footer"
>("card", {
  parts: ["header", "title", "description", "action", "content", "footer"],
  base: {
    root: "flex flex-col gap-4 border border-border rounded-2xl bg-card text-card-foreground p-4",
    header: "grid grid-cols-1 items-start gap-1.5",
    title: "m-0 text-base font-semibold leading-tight",
    description: "m-0 text-sm text-muted-foreground",
    action: "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
    content: "min-w-0",
    footer: "flex flex-wrap items-center gap-2",
  },
  variants: {
    size: {
      // `default` renders no `data-size`; the base styles it.
      default: "",
      sm: { root: "gap-3 p-3", title: "text-sm" },
    },
  },
});
