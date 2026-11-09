import type { ControlSize } from "../../components/internal/control-size/types.js";
import { defineRecipe } from "../define.js";

export const nativeSelect = defineRecipe<{ size: ControlSize }, "item" | "group" | "separator">(
  "native-select",
  {
    parts: ["item", "group", "separator"],
    base: {
      root: "inline-full min-inline-48 max-w-field flex items-center gap-3 box-border block-control-md px-control-x border border-solid border-input rounded-control bg-card text-foreground text-control leading-normal cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:border-primary disabled:opacity-50 disabled:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
      item: "flex items-center gap-3 py-2 px-3 rounded-lg text-foreground cursor-pointer text-base hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none",

      group: "pbs-1 px-3 text-muted-foreground text-xs font-semibold",
      separator: "my-1 border-0 border-bs border-solid border-border",
    },
    variants: {
      size: {
        sm: { root: "block-control-sm text-control-sm" },
        md: { root: "" },
        lg: { root: "block-control-lg text-control-lg" },
      },
    },
  },
);
