import { defineRecipe } from "../define.js";

export const inputOtp = defineRecipe("input-otp", {
  parts: ["slot", "control"],
  base: {
    root: "relative inline-flex gap-2 cursor-text",
    slot: "inline-flex items-center justify-center border border-input rounded-control bg-card text-foreground font-medium tabular-nums transition-colors data-[active]:border-primary data-[active]:outline-2 data-[active]:outline-offset-0 data-[filled]:border-input data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
    control: "",
  },
});
