import { expect, it } from "vitest";
import type { VirtualScrollItem, VirtualScrollOwnProps } from "./types.js";

interface Item extends VirtualScrollItem {
  readonly title: string;
}

it("types generated virtual rows as native div props with consumer-selected semantics", () => {
  const props: VirtualScrollOwnProps<Item> = {
    items: [{ id: "one", title: "One" }],
    renderRow: (item) => item.title,
    slotProps: {
      spacer: { className: "spacer" },
      row: {
        className: "row",
        byItemValue: { one: { "data-testid": "row-one", "aria-label": "First item" } },
      },
    },
  };
  const overrides: VirtualScrollOwnProps<Item> = {
    items: [],
    renderRow: () => null,
    role: "note",
    slotProps: {
      row: { "data-part": "other", role: "note", "aria-posinset": undefined },
      spacer: { "data-part": undefined },
    },
  };
  const removedRole: VirtualScrollOwnProps<Item> = {
    items: [],
    renderRow: () => null,
    role: undefined,
  };
  expect([props, overrides, removedRole]).toHaveLength(3);
});
