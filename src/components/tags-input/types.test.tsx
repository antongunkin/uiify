import { expect, it } from "vitest";
import type {
  TagsInputListOwnProps,
  TagsInputRootProps,
  TagsInputTagRemoveOwnProps,
} from "./types.js";

it("accepts native props on the root, list, generated tags and input wrapper", () => {
  const root: TagsInputRootProps = {
    defaultValue: ["React"],
    title: "Tags",
    "data-testid": "tags-root",
  };
  const list: TagsInputListOwnProps = {
    "data-testid": "tags-list",
    slotProps: {
      tag: {
        className: "tag",
        byItemIndex: { 0: { "data-testid": "tag-react" } },
      },
      input: { className: "input-slot", "data-testid": "input-slot" },
    },
  };
  const remove: TagsInputTagRemoveOwnProps = {
    index: 0,
    title: "Remove React",
    "aria-label": "Remove React tag",
    "data-testid": "remove-react",
  };

  expect([root, list, remove].length).toBe(3);
});

it("accepts native anatomy and remove-button overrides", () => {
  const invalidTagValue: TagsInputListOwnProps = {
    slotProps: { tag: { "data-value": "other" } },
  };
  const invalidTagIndex: TagsInputListOwnProps = {
    slotProps: { tag: { "data-index": "other" } },
  };
  const invalidRemoveType: TagsInputTagRemoveOwnProps = {
    index: 0,
    type: "submit",
  };
  expect([invalidTagValue, invalidTagIndex, invalidRemoveType].length).toBe(3);
});
