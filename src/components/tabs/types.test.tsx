import { expect, expectTypeOf, it } from "vitest";
import type { TabsContentProps, TabsProps, TabsTriggerProps } from "./types.js";

it("items and defaultValue are gone from Tabs", () => {
  expectTypeOf<TabsProps>().not.toHaveProperty("items");
  expectTypeOf<TabsProps>().not.toHaveProperty("defaultValue");
  const noRootDefault: TabsProps = {
    // @ts-expect-error Select initially with defaultChecked on one TabsTrigger.
    defaultValue: "a",
  };
  const noItems: TabsProps = {
    // @ts-expect-error Tabs takes TabsList/TabsTrigger/TabsContent children, not an items array.
    items: [{ value: "a", label: "A" }],
  };
  expect([noRootDefault, noItems]).toHaveLength(2);
});

it("requires name and value on TabsTrigger", () => {
  const valid: TabsTriggerProps = { name: "account", value: "profile" };
  // @ts-expect-error The browser groups the radios by name: it is required.
  const noName: TabsTriggerProps = { value: "profile" };
  // @ts-expect-error The value pairs the trigger with its content: it is required.
  const noValue: TabsTriggerProps = { name: "account" };
  // @ts-expect-error The label always points at its own radio.
  const htmlFor: TabsTriggerProps = { name: "account", value: "profile", htmlFor: "other" };
  expect([valid, noName, noValue, htmlFor]).toHaveLength(4);
});

it("requires value on TabsContent", () => {
  const valid: TabsContentProps = { value: "profile" };
  // @ts-expect-error The value documents the matching trigger: it is required.
  const noValue: TabsContentProps = {};
  expect([valid, noValue]).toHaveLength(2);
});
