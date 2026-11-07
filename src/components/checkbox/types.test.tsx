import { expect, it } from "vitest";
import type {
  CheckboxClientProps,
  CheckboxGroupProps,
  CheckboxProps,
  CheckboxSlotProps,
} from "./types.js";

it("rejects generated content on native checkbox slots", () => {
  const invalidChildren: CheckboxSlotProps = {
    input: {
      // @ts-expect-error The checkbox input has no consumer-owned children.
      children: "replacement",
    },
  };
  const invalidMarkup: CheckboxSlotProps = {
    input: {
      // @ts-expect-error Native input slots cannot inject HTML.
      dangerouslySetInnerHTML: { __html: "<span>replacement</span>" },
    },
  };

  expect([invalidChildren, invalidMarkup]).toHaveLength(2);
});

it("rejects generated content on the native input props", () => {
  const invalid: CheckboxProps = {
    id: "html",
    // @ts-expect-error The void input cannot take injected HTML.
    dangerouslySetInnerHTML: { __html: "x" },
  };

  expect(invalid.id).toBe("html");
});

it("keeps the mixed state on the client entry", () => {
  const invalidDefault: CheckboxProps = {
    id: "all",
    // @ts-expect-error The Tier 0 Checkbox accepts boolean checked only.
    checked: "indeterminate",
  };
  const client: CheckboxClientProps = { id: "all", checked: "indeterminate" };
  const group: CheckboxGroupProps = {
    id: "contact",
    items: [{ value: "email", label: "Email" }],
    defaultValue: ["email"],
  };
  const invalidGroup: CheckboxGroupProps = {
    id: "contact",
    // @ts-expect-error Group items require a value and a label.
    items: [{ value: "email" }],
  };

  expect([invalidDefault, client, group, invalidGroup]).toHaveLength(4);
});
