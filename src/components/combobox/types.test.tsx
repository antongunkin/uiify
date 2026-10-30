import { expect, it } from "vitest";
import type {
  ComboboxContentOwnProps,
  ComboboxEmptyOwnProps,
  ComboboxItemOwnProps,
  ComboboxTagsOwnProps,
} from "./types.js";

it("accepts native props for generated and public combobox parts", () => {
  const tags: ComboboxTagsOwnProps = {
    slotProps: {
      tag: { className: "tag", byItemValue: { apple: { "data-testid": "apple-tag" } } },
      remove: {
        byItemValue: { apple: { className: "remove", "data-testid": "remove-apple" } },
      },
    },
  };
  const content: ComboboxContentOwnProps = {
    children: () => null,
    title: "Filtered results",
    "data-testid": "listbox",
  };
  const item: ComboboxItemOwnProps = {
    item: { label: "Apple", value: "apple" },
    "data-testid": "apple-option",
  };
  const empty: ComboboxEmptyOwnProps = {
    children: "No results",
    "data-testid": "empty",
  };

  expect([tags, content, item, empty].length).toBe(4);
});

it("accepts native combobox anatomy and remove-button overrides", () => {
  const invalidRemoveType: ComboboxTagsOwnProps = {
    slotProps: { remove: { type: "submit" } },
  };
  const invalidRemoveLabel: ComboboxTagsOwnProps = {
    slotProps: { remove: { "aria-label": "Custom label" } },
  };
  const invalidTagPart: ComboboxTagsOwnProps = {
    slotProps: { tag: { "data-part": "other" } },
  };
  const invalidContentId: ComboboxContentOwnProps = {
    children: () => null,
    id: "other",
  };
  const invalidItemRole: ComboboxItemOwnProps = {
    item: { label: "Apple", value: "apple" },
    role: "button",
  };
  const invalidEmptyRole: ComboboxEmptyOwnProps = {
    children: "No results",
    role: "status",
  };
  const invalidItemState: ComboboxItemOwnProps = {
    item: { label: "Apple", value: "apple" },
    "data-selected": "false",
  };
  const invalidEmptyPart: ComboboxEmptyOwnProps = {
    children: "No results",
    "data-part": "other",
  };

  expect(
    [
      invalidRemoveType,
      invalidRemoveLabel,
      invalidTagPart,
      invalidContentId,
      invalidItemRole,
      invalidEmptyRole,
      invalidItemState,
      invalidEmptyPart,
    ].length,
  ).toBe(8);
});
