import { expect, it } from "vitest";
import type { VirtualScrollItem, VirtualScrollOwnProps } from "./types.js";

interface Item extends VirtualScrollItem {
  readonly title: string;
}

it("types generated virtual rows as native div props without exposing owned semantics", () => {
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
  const invalidPart: VirtualScrollOwnProps<Item> = {
    items: [],
    renderRow: () => null,
    slotProps: {
      row: {
        // @ts-expect-error The row part marker belongs to VirtualScroll.
        "data-part": "other",
      },
    },
  };
  const invalidSpacerPart: VirtualScrollOwnProps<Item> = {
    items: [],
    renderRow: () => null,
    slotProps: {
      spacer: {
        // @ts-expect-error The spacer part marker belongs to VirtualScroll.
        "data-part": "other",
      },
    },
  };

  expect([props, invalidPart, invalidSpacerPart]).toHaveLength(3);
});
