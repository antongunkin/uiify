import { expect, it } from "vitest";
import type { ContextMenuRootProps, ContextMenuRootSlotProps } from "./types.js";

it("accepts native virtual-anchor slot props", () => {
  const props = {
    slotProps: {
      virtualAnchor: {
        className: "context-anchor",
        "data-testid": "context-anchor",
        onClick: () => {},
      },
    },
  } satisfies ContextMenuRootProps;

  const overridden: ContextMenuRootSlotProps["virtualAnchor"] = {
    "data-virtual-anchor": "false",
  };

  expect([props.slotProps?.virtualAnchor?.className, overridden]).toBeTruthy();
});
