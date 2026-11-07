import { defineRecipe } from "../define.js";

export const numberField = defineRecipe<
  Record<never, string>,
  "group" | "input" | "decrement" | "increment"
>("number-field", {
  parts: ["group", "input", "decrement", "increment"],
  childParts: ["group"],
  requires: ["button", "input"],
  base: {
    root: "relative inline-flex items-stretch overflow-hidden rounded-md border border-input bg-card focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
    group: "inline-flex items-stretch",
    input:
      "w-16 min-h-9 px-3 py-0 border-0 bg-transparent text-foreground text-center leading-5 outline-none",
    decrement:
      "inline-flex w-9 h-9 flex-none items-center justify-center border-0 border-s border-border bg-transparent p-0 text-lg leading-none text-foreground cursor-pointer transition-colors hover:bg-foreground/10 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 first:border-s-0 first:border-e first:border-e-border",
    increment:
      "inline-flex w-9 h-9 flex-none items-center justify-center border-0 border-s border-border bg-transparent p-0 text-lg leading-none text-foreground cursor-pointer transition-colors hover:bg-foreground/10 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
  },
});
