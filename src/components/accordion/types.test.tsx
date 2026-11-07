import { expect, expectTypeOf, it } from "vitest";
import type { AccordionItemProps, AccordionProps, AccordionTriggerProps } from "./types.js";

it("items, type, collapsible and defaultValue are gone from Accordion", () => {
  expectTypeOf<AccordionProps>().not.toHaveProperty("items");
  expectTypeOf<AccordionProps>().not.toHaveProperty("type");
  expectTypeOf<AccordionProps>().not.toHaveProperty("collapsible");
  expectTypeOf<AccordionProps>().not.toHaveProperty("defaultValue");
  const noDefault: AccordionProps = {
    // @ts-expect-error Open an item initially with defaultOpen on AccordionItem.
    defaultValue: "a",
  };
  const noType: AccordionProps = {
    // @ts-expect-error Single-open is the same name on every AccordionItem.
    type: "single",
  };
  const noCollapsible: AccordionProps = {
    // @ts-expect-error Native details always collapse.
    collapsible: true,
  };
  const noItems: AccordionProps = {
    // @ts-expect-error Accordion takes AccordionItem children, not an items array.
    items: [{ value: "a", label: "A" }],
  };
  expect([noDefault, noType, noCollapsible, noItems]).toHaveLength(4);
});

it("requires value on AccordionItem and keeps name optional", () => {
  const single: AccordionItemProps = { value: "a", name: "faq", defaultOpen: true };
  const multiple: AccordionItemProps = { value: "a" };
  // @ts-expect-error The value identifies the item: it is required.
  const noValue: AccordionItemProps = { name: "faq" };
  // @ts-expect-error A details item cannot take an anchor-only href.
  const href: AccordionItemProps = { value: "a", href: "/x" };
  expect([single, multiple, noValue, href]).toHaveLength(4);
});

it("puts disabled on AccordionTrigger, not on AccordionItem", () => {
  const trigger: AccordionTriggerProps = { disabled: true };
  expectTypeOf<AccordionItemProps>().not.toHaveProperty("disabled");
  expect(trigger.disabled).toBe(true);
});
