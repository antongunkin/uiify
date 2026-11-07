import { expect, it } from "vitest";
import type { PopoverContentProps } from "./types.js";

it("requires an id on the native content part and excludes hint", () => {
  const content: PopoverContentProps = { id: "help", mode: "manual" };
  // @ts-expect-error -- id is the native relationship; it is required.
  const missingId: PopoverContentProps = { mode: "auto" };
  // @ts-expect-error -- hint is not part of the cross-engine baseline.
  const hint: PopoverContentProps = { id: "help", mode: "hint" };
  expect([content, missingId, hint]).toHaveLength(3);
});
