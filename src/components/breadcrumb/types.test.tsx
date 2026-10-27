import { expect, it } from "vitest";
import type { BreadcrumbEllipsisPartProps, BreadcrumbListProps } from "./types.js";

it("accepts native props for generated breadcrumb parts and protects link state", () => {
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
            // @ts-expect-error The item data owns the destination.
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
        // @ts-expect-error The disclosure label comes from Breadcrumb labels.
        "aria-label": "Other label",
      },
    },
  };
  const invalidAnatomy: BreadcrumbListProps = {
    items: [],
    slotProps: {
      item: {
        // @ts-expect-error Breadcrumb owns its part markers.
        "data-part": "other",
      },
    },
  };
  const standalone: BreadcrumbEllipsisPartProps = {
    slotProps: { item: { "data-testid": "ellipsis-item" }, ellipsis: { className: "glyph" } },
  };

  expect([valid, invalidHref, invalidSummaryLabel, invalidAnatomy, standalone].length).toBe(5);
});
