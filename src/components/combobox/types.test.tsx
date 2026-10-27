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

it("keeps generated combobox anatomy and remove-button semantics owned", () => {
  const invalidRemoveType: ComboboxTagsOwnProps = {
    // @ts-expect-error The remove button type is owned by Combobox.
    slotProps: { remove: { type: "submit" } },
  };
  const invalidRemoveLabel: ComboboxTagsOwnProps = {
    // @ts-expect-error The remove button accessible name is owned by Combobox.
    slotProps: { remove: { "aria-label": "Custom label" } },
  };
  const invalidTagPart: ComboboxTagsOwnProps = {
    // @ts-expect-error Generated anatomy markers are library-owned.
    slotProps: { tag: { "data-part": "other" } },
  };
  const invalidContentId: ComboboxContentOwnProps = {
    children: () => null,
    // @ts-expect-error The listbox id is linked to its input.
    id: "other",
  };
  const invalidItemRole: ComboboxItemOwnProps = {
    item: { label: "Apple", value: "apple" },
    // @ts-expect-error Combobox.Item always renders an option.
    role: "button",
  };
  const invalidEmptyRole: ComboboxEmptyOwnProps = {
    children: "No results",
    // @ts-expect-error The empty state is presentational.
    role: "status",
  };
  const invalidItemState: ComboboxItemOwnProps = {
    item: { label: "Apple", value: "apple" },
    // @ts-expect-error Option state is owned by Combobox.
    "data-selected": "false",
  };
  const invalidEmptyPart: ComboboxEmptyOwnProps = {
    children: "No results",
    // @ts-expect-error Generated anatomy markers are library-owned.
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
