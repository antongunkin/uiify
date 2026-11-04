import { expect, it } from "vitest";
import type {
  ComboboxFormControlProps,
  ComboboxContentOwnProps,
  ComboboxEmptyOwnProps,
  ComboboxItemOwnProps,
  ComboboxGroupOwnProps,
  ComboboxGroupLabelOwnProps,
  ComboboxRootMultiProps,
  ComboboxRootSingleProps,
  ComboboxTagsOwnProps,
} from "./types.js";

const noSelection: ComboboxRootSingleProps = { items: [], value: null };
const emptyId: ComboboxRootSingleProps = { items: [], defaultValue: "" };
const multipleSelection: ComboboxRootMultiProps = { items: [], multiple: true, value: [""] };
const nullableCallback: ComboboxRootSingleProps = {
  items: [],
  onValueChange: (value) => {
    const nextValue: string | null = value;
    return nextValue;
  },
};
const customSingle: ComboboxRootSingleProps = {
  items: [],
  allowCustomValue: true,
  validateValue: (value) => value.length > 2,
};

// @ts-expect-error Single selection is a string ID or null, never an array.
const singleArray: ComboboxRootSingleProps = { items: [], value: ["apple"] };
// @ts-expect-error Multiple selection remains an array and cannot use null.
const multipleNull: ComboboxRootMultiProps = { items: [], multiple: true, value: null };
const narrowCallback: ComboboxRootSingleProps = {
  items: [],
  // @ts-expect-error Single callback must accept null from a cleared selection.
  onValueChange: (value: string) => value,
};
// @ts-expect-error maxValues is a multi-value-only option.
const singleMaxValues: ComboboxRootSingleProps = { items: [], maxValues: 2 };

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
    children: <span>Apple, locally grown</span>,
    "data-testid": "apple-option",
  };
  const group: ComboboxGroupOwnProps = {
    children: <span>Fruit</span>,
    "aria-labelledby": "fruit-label",
  };
  const groupLabel: ComboboxGroupLabelOwnProps = { id: "fruit-label", children: "Fruit" };
  const empty: ComboboxEmptyOwnProps = {
    children: "No results",
    "data-testid": "empty",
  };

  expect([tags, content, item, group, groupLabel, empty].length).toBe(6);
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

it("keeps single nullable IDs distinct from multiple arrays", () => {
  expect([
    noSelection.value,
    emptyId.defaultValue,
    multipleSelection.value,
    nullableCallback.items,
  ]).toEqual([null, "", [""], []]);
  expect([singleArray, multipleNull, narrowCallback, customSingle, singleMaxValues].length).toBe(5);
});

// @ts-expect-error Root owns option content.
const formChildren: ComboboxFormControlProps = { children: "option" };
// @ts-expect-error The native proxy is always multiple.
const formMultiple: ComboboxFormControlProps = { multiple: false };
// @ts-expect-error Root owns selected values.
const formValue: ComboboxFormControlProps = { value: "apple" };
// @ts-expect-error Root owns the reset defaults.
const formDefaultValue: ComboboxFormControlProps = { defaultValue: "apple" };
// @ts-expect-error Selection changes must go through Root.
const formChange: ComboboxFormControlProps = { onChange: () => {} };

it("keeps form proxy selection and options under Root ownership", () => {
  const native: ComboboxFormControlProps = {
    name: "fruit",
    form: "profile",
    required: true,
    disabled: false,
    className: "consumer",
    style: { opacity: 0.5 },
    "data-custom": "yes",
    ref: (node) => {
      const select: HTMLSelectElement | null = node;
      return void select;
    },
    onInvalid: (event) => event.preventDefault(),
  };
  expect([
    native,
    formChildren,
    formMultiple,
    formValue,
    formDefaultValue,
    formChange,
  ]).toHaveLength(6);
});
