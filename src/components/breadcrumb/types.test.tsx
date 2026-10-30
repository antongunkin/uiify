import { expect, it } from "vitest";
import type { BreadcrumbEllipsisPartProps, BreadcrumbListProps } from "./types.js";

it("accepts native overrides for generated breadcrumb parts", () => {
  const valid: BreadcrumbListProps = {
    items: [{ href: "/docs", key: "docs", label: "Docs" }],
    slotProps: {
      item: { byItemValue: { docs: { "data-testid": "docs-item" } } },
      link: { byItemValue: { docs: { className: "docs-link", "data-testid": "docs-link" } } },
      ellipsisItem: { className: "ellipsis-item" },
      ellipsis: { className: "ellipsis-details" },
      ellipsisTrigger: { className: "ellipsis-trigger" },
      ellipsisContent: { className: "ellipsis-list" },
    },
  };
  const invalidHref: BreadcrumbListProps = {
    items: [{ href: "/docs", key: "docs", label: "Docs" }],
    slotProps: {
      link: {
        byItemValue: {
          docs: {
            href: "/elsewhere",
          },
        },
      },
    },
  };
  const invalidSummaryLabel: BreadcrumbListProps = {
    items: [],
    slotProps: {
      ellipsisTrigger: {
        "aria-label": "Other label",
      },
    },
  };
  const invalidAnatomy: BreadcrumbListProps = {
    items: [],
    slotProps: {
      item: {
        "data-part": "other",
      },
    },
  };
  const standalone: BreadcrumbEllipsisPartProps = {
    slotProps: { item: { "data-testid": "ellipsis-item" }, ellipsis: { className: "glyph" } },
  };

  expect([valid, invalidHref, invalidSummaryLabel, invalidAnatomy, standalone].length).toBe(5);
});
