import { expect, it } from "vitest";
import type { AccordionItem, AccordionProps } from "./types.js";

it("keeps the data-driven accordion types narrow", () => {
  // @ts-expect-error -- __groupId was part of the removed authored-child API.
  const item: AccordionItem = { value: "a", label: "A", __groupId: "accordion" };
  // @ts-expect-error -- children are not part of the data-driven root API.
  const props: AccordionProps = { id: "accordion", items: [], children: null };
  const slotProps: AccordionProps = {
    id: "accordion",
    items: [],
    slotProps: { trigger: { "data-testid": "trigger" } },
  };
  // @ts-expect-error -- slot names are the audited Accordion anatomy.
  const unknownSlot: AccordionProps = { id: "accordion", items: [], slotProps: { control: {} } };
  const ownedState: AccordionProps = {
    id: "accordion",
    items: [],
    slotProps: {
      item: {
        byItemValue: {
          open: {
            // @ts-expect-error -- browser-owned open state cannot be set through slotProps.
            open: true,
            // @ts-expect-error -- the single-mode group name is component-owned.
            name: "other",
          },
        },
      },
    },
  };
  const wrongElementProp: AccordionProps = {
    id: "accordion",
    items: [],
    // @ts-expect-error -- a details slot cannot accept an anchor-only href.
    slotProps: { item: { href: "/not-a-link" } },
  };

  expect([item, props, slotProps, unknownSlot, ownedState, wrongElementProp]).toHaveLength(6);
});
