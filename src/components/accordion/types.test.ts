import { expect, it } from "vitest";
import type { AccordionItem, AccordionProps } from "./types.js";

it("keeps the data-driven accordion types narrow", () => {
  // @ts-expect-error -- __groupId was part of the removed authored-child API.
  const item: AccordionItem = { value: "a", label: "A", __groupId: "accordion" };
  // @ts-expect-error -- children are not part of the data-driven root API.
  const props: AccordionProps = { id: "accordion", items: [], children: null };

  expect([item, props]).toHaveLength(2);
});
