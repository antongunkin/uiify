import { defineRecipe } from "../define.js";

export const alert = defineRecipe("alert", {
  parts: ["symbol", "title", "description"],
  base: {
    root: "relative block box-border inline-full min-inline-0 px-4 py-3 rounded-lg border border-solid border-border bg-card text-card-foreground text-sm leading-5 wrap-anywhere text-pretty",
    symbol:
      "absolute inset-bs-3.5 start-4 grid place-items-center inline-4 block-4 text-base leading-none",
    title: "m-0 font-semibold",
    description: "m-0 text-muted-foreground leading-normal",
  },
});
