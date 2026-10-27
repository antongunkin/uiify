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

  const invalid: ContextMenuRootSlotProps["virtualAnchor"] = {
    // @ts-expect-error Library-owned anchor identity cannot be overridden.
    "data-virtual-anchor": "false",
  };

  expect([props.slotProps?.virtualAnchor?.className, invalid]).toBeTruthy();
});
