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

it("protects pagination state, behavior and generated labels", () => {
  const invalidSelected: PaginationRootProps = {
    count: 20,
    // @ts-expect-error The page link's selected state is owned by Pagination.
    slotProps: { link: { "data-selected": "false" } },
  };
  const invalidControlType: PaginationRootProps = {
    count: 20,
    // @ts-expect-error Pagination controls always render buttons.
    slotProps: { control: { type: "submit" } },
  };
  const invalidEllipsisLabel: PaginationRootProps = {
    count: 20,
    // @ts-expect-error Ellipses are hidden from assistive technology.
    slotProps: { ellipsis: { "aria-hidden": false } },
  };

  expect([invalidSelected, invalidControlType, invalidEllipsisLabel].length).toBe(3);
});
