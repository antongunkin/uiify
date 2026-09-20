import { expect, it } from "vitest";
import type {
  PopupContentProps,
  PopupRootCloseProps,
  PopupRootContentProps,
  PopupRootTriggerProps,
} from "./types.js";

it("keeps the internal injection channel out of the legacy compound prop types", () => {
  // @ts-expect-error -- __popupId is internal; it must not be assignable here.
  const trigger: PopupRootTriggerProps = { __popupId: "menu" };
  // @ts-expect-error -- __mode is internal; it must not be assignable here.
  const triggerMode: PopupRootTriggerProps = { __mode: "auto" };
  // @ts-expect-error -- __popupId is internal; it must not be assignable here.
  const content: PopupRootContentProps = { __popupId: "menu" };
  // @ts-expect-error -- __popupId is internal; it must not be assignable here.
  const close: PopupRootCloseProps = { __popupId: "menu" };

  expect([trigger, triggerMode, content, close]).toHaveLength(4);
});

it("keeps the consumer-facing legacy props", () => {
  const content: PopupRootContentProps = { align: "start", side: "top" };
  expect(content.side).toBe("top");
});

it("requires an id on the native content part and excludes hint", () => {
  const content: PopupContentProps = { id: "help", mode: "manual" };
  // @ts-expect-error -- id is the native relationship; it is required.
  const missingId: PopupContentProps = { mode: "auto" };
  // @ts-expect-error -- hint is not part of the cross-engine baseline.
  const hint: PopupContentProps = { id: "help", mode: "hint" };
  expect([content, missingId, hint]).toHaveLength(3);
});
