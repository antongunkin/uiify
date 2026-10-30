import { expect, it } from "vitest";
import type { PaginationRootProps } from "./types.js";

it("accepts native props for generated pagination parts by stable item key", () => {
  const props: PaginationRootProps = {
    count: 20,
    page: 5,
    slotProps: {
      list: { className: "list", "data-testid": "page-list" },
      item: { byItemValue: { "page:5": { className: "selected-item" } } },
      link: { byItemValue: { "page:5": { "data-testid": "selected-page" } } },
      control: { byItemValue: { next: { title: "Next page" } } },
      ellipsis: { byItemValue: { "ellipsis:2": { className: "ellipsis" } } },
    },
  };

  expect(props.count).toBe(20);
});

it("accepts native overrides for pagination defaults", () => {
  const invalidSelected: PaginationRootProps = {
    count: 20,
    slotProps: { link: { "data-selected": "false" } },
  };
  const invalidControlType: PaginationRootProps = {
    count: 20,
    slotProps: { control: { type: "submit" } },
  };
  const invalidEllipsisLabel: PaginationRootProps = {
    count: 20,
    slotProps: { ellipsis: { "aria-hidden": false } },
  };

  expect([invalidSelected, invalidControlType, invalidEllipsisLabel].length).toBe(3);
});
