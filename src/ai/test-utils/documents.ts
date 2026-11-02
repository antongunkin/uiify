import type { UiNodeInput } from "../catalog.generated.js";

/** A search form: a native label, a select and a submit button inside a GET form. */
export const filterDocument = {
  type: "form",
  props: { method: "get", role: "search" },
  children: [
    {
      type: "Stack",
      props: { direction: "block", gap: "md" },
      children: [
        { type: "label", props: { htmlFor: "status" }, children: ["Status"] },
        {
          type: "Select.Root",
          props: { id: "status", name: "status" },
          children: [
            { type: "Select.Item", props: { value: "open" }, children: ["Open"] },
            { type: "Select.Item", props: { value: "closed" }, children: ["Closed"] },
          ],
        },
        { type: "Button", props: { type: "submit" }, children: ["Apply"] },
      ],
    },
  ],
} satisfies UiNodeInput;

/** A settings form: a fieldset, a text input with a native label, a switch and a save button. */
export const settingsDocument = {
  type: "form",
  props: { method: "post", action: "/settings" },
  children: [
    {
      type: "Stack",
      props: { gap: "lg" },
      children: [
        { type: "h1", props: { id: "settings-title" }, children: ["Settings"] },
        {
          type: "Fieldset",
          props: { id: "profile" },
          children: [
            { type: "FieldsetLegend", props: { id: "profile-legend" }, children: ["Profile"] },
            { type: "label", props: { htmlFor: "display-name" }, children: ["Display name"] },
            { type: "Input", props: { id: "display-name", name: "displayName", type: "text" } },
            {
              type: "label",
              props: { htmlFor: "newsletter" },
              children: ["Email me product news"],
            },
            { type: "Switch", props: { id: "newsletter", name: "newsletter" } },
          ],
        },
        { type: "Button", props: { type: "submit" }, children: ["Save changes"] },
      ],
    },
  ],
} satisfies UiNodeInput;

function plan(
  name: string,
  price: string,
  features: readonly string[],
  action: string,
): UiNodeInput {
  return {
    type: "Card",
    props: {},
    children: [
      { type: "h2", props: {}, children: [name] },
      { type: "p", props: {}, children: [price] },
      {
        type: "ul",
        props: {},
        children: features.map(
          (feature): UiNodeInput => ({ type: "li", props: {}, children: [feature] }),
        ),
      },
      { type: "Button", props: { variant: "outline" }, children: [action] },
    ],
  };
}

/** Plan cards in a grid; every card has the same parts in the same order so actions line up. */
export const pricingDocument = {
  type: "Grid",
  props: { columns: 3, gap: "md" },
  children: [
    plan("Free", "$0", ["1 project", "Community support"], "Start free"),
    plan("Team", "$12", ["10 projects", "Email support"], "Choose Team"),
    plan("Business", "$40", ["Unlimited projects", "Priority support"], "Choose Business"),
  ],
} satisfies UiNodeInput;
