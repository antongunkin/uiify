import { defineRecipe } from "../define.js";

/**
 * Parts own their appearance, even when composed through an intermediate wrapper. Base part rules
 * are plain class selectors, so FieldContent/FieldTitle/FieldGroup also work outside a Field root.
 * `responsive` switches to a row when the nearest size container (FieldGroup) is `@md` (28rem).
 * `variant="card"` draws a bordered choice card; its label's `::after` covers the card, so a click
 * anywhere activates the label and selects the control. The scope stops at a nested Field.
 */
export const field = defineRecipe<
  { orientation: "vertical" | "horizontal" | "responsive"; variant: "card" },
  "label" | "description" | "error" | "content" | "title" | "group"
>("field", {
  parts: ["label", "description", "error", "content", "title", "group"],
  // field.css is public: it also styles FieldSet/FieldLegend and FieldSeparator on its own.
  requires: ["input", "textarea", "field-set", "field-separator"],
  base: {
    root: "grid gap-2 w-full max-w-field",
    label: "text-foreground text-sm font-medium leading-normal select-none",
    description: "m-0 text-muted-foreground text-xs leading-normal",
    error:
      "m-0 text-destructive text-xs leading-normal motion-safe:transition-opacity motion-safe:starting:opacity-0",
    content: "grid flex-1 gap-1 min-w-0",
    title: "text-foreground text-sm font-medium leading-normal",
    group: "@container grid gap-6 w-full",
  },
  variants: {
    orientation: {
      vertical: "",
      horizontal: { root: "flex flex-row items-start gap-3" },
      responsive: {
        // In the row the parts size to their content, as shadcn's field does: a full-width control
        // would squeeze the label (fields fill their container since 2026-11-09).
        root: "flex flex-col @md:flex-row @md:items-center @md:gap-4 @md:max-w-none @md:*:w-auto",
      },
    },
    variant: {
      card: {
        root: "relative max-w-none items-start gap-3 rounded-2xl border border-border p-4 cursor-pointer transition-colors has-checked:border-primary has-checked:bg-primary/5 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring has-disabled:opacity-50 has-disabled:cursor-not-allowed",
        label: "after:absolute after:inset-0",
      },
    },
  },
  defaultVariants: { orientation: "vertical" },
});
