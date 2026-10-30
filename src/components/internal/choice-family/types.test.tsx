import { expect, it } from "vitest";
import type { RadioGroupProps } from "../../radio-group/types.js";
import type { SegmentedControlProps } from "../../segmented-control/types.js";
import type { ToggleGroupProps } from "../../toggle-group/types.js";
import type { ChoiceInputSlotProps } from "../../../elements/choice/types.js";

it("accepts consumer props, including generated state and relationships", () => {
  const directChoiceInput: ChoiceInputSlotProps = {
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
        checked: true,
        byItemValue: {
          basic: {
            "data-part": "other",
          },
        },
      },
      label: {
        htmlFor: "other",
      },
      item: {
        byItemValue: {
          basic: {
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
