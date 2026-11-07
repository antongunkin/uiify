import { expect, expectTypeOf, it } from "vitest";
import type { RadioGroupItemProps, RadioGroupProps } from "./types.js";

it("items prop is gone", () => {
  expectTypeOf<RadioGroupProps>().not.toHaveProperty("items");
  expectTypeOf<RadioGroupProps>().not.toHaveProperty("defaultValue");
  const noGroupDefault: RadioGroupProps = {
    // @ts-expect-error Select initially with defaultChecked on one RadioGroupItem.
    defaultValue: "a",
  };
  expect(noGroupDefault).toBeTruthy();
  const invalid: RadioGroupProps = {
    "aria-label": "Plan",
    // @ts-expect-error RadioGroup takes RadioGroupItem children, not an items array.
    items: [{ value: "a", label: "A" }],
  };
  expect(invalid["aria-label"]).toBe("Plan");
});

it("requires name and value on RadioGroupItem", () => {
  const valid: RadioGroupItemProps = { name: "plan", value: "a" };
  // @ts-expect-error The browser groups radios by name: it is required.
  const noName: RadioGroupItemProps = { value: "a" };
  // @ts-expect-error A radio without a value submits "on": it is required.
  const noValue: RadioGroupItemProps = { name: "plan" };
  expect([valid, noName, noValue]).toHaveLength(3);
});

it("fixes the input type and rejects generated content", () => {
  const typed: RadioGroupItemProps = {
    name: "plan",
    value: "a",
    // @ts-expect-error RadioGroupItem always renders type="radio".
    type: "checkbox",
  };
  const markup: RadioGroupItemProps = {
    name: "plan",
    value: "a",
    // @ts-expect-error The void input cannot take injected HTML.
    dangerouslySetInnerHTML: { __html: "x" },
  };
  expect([typed, markup]).toHaveLength(2);
});
