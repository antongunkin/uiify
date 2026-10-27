import { expect, it } from "vitest";
import type { RadioGroupProps } from "../../radio-group/types.js";
import type { SegmentedControlProps } from "../../segmented-control/types.js";
import type { ToggleGroupProps } from "../../toggle-group/types.js";
import type { ChoiceInputSlotProps } from "../../../elements/choice/types.js";

it("accepts consumer props and rejects Choice-owned state and relationships", () => {
  const directChoiceInput: ChoiceInputSlotProps = {
    // @ts-expect-error -- checked state is owned by Choice.Item.
    checked: true,
  };
  const valid: RadioGroupProps = {
    id: "plans",
    items: [],
    title: "Plans",
    slotProps: {
      item: {
        className: "item",
        byItemValue: { basic: { "data-testid": "basic-item" } },
      },
      input: {
        className: "radio",
        byItemValue: {
          basic: {
            "data-testid": "basic-radio",
            // @ts-expect-error -- checked state is also protected per item.
            checked: true,
          },
        },
      },
      label: { title: "Plan label" },
    },
  };
  const owned: RadioGroupProps = {
    id: "plans",
    items: [],
    slotProps: {
      input: {
        // @ts-expect-error -- checked state is owned by the group.
        checked: true,
        byItemValue: {
          basic: {
            // @ts-expect-error -- generated part markers cannot be assigned by consumers.
            "data-part": "other",
          },
        },
      },
      label: {
        // @ts-expect-error -- native label association is generated from the item's value.
        htmlFor: "other",
      },
      item: {
        byItemValue: {
          basic: {
            // @ts-expect-error -- generated wrapper markers are library-owned.
            "data-part": "other",
          },
        },
      },
    },
  };
  const invalidRoot: RadioGroupProps = {
    id: "plans",
    items: [],
    // @ts-expect-error -- the group root cannot replace generated content.
    dangerouslySetInnerHTML: { __html: "unsafe" },
  };
  const noPanelSlot: ToggleGroupProps = {
    id: "align",
    items: [],
    slotProps: {
      // @ts-expect-error -- ToggleGroup does not render a panel.
      panel: {},
    },
  };
  const segmented: SegmentedControlProps = {
    id: "range",
    items: [],
    slotProps: { label: { "data-testid": "trigger" } },
  };

  expect([directChoiceInput, valid, owned, invalidRoot, noPanelSlot, segmented]).toHaveLength(6);
});
