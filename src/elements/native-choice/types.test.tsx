import type { ReactElement } from "react";
import { expect, it } from "vitest";
import { NativeChoiceGroup, NativeChoiceItem } from "./NativeChoice.js";
import type { NativeChoiceItemSlotProps } from "./types.js";

it("requires groupId and kind explicitly on every item — Tier 0 has no context to inject them", () => {
  const elements: ReactElement[] = [
    <NativeChoiceItem key="default" groupId="plan" kind="single" label="Free" value="free" />,
    // @ts-expect-error -- groupId is required; there is no implicit Group -> Item injection.
    <NativeChoiceItem key="missing-group" kind="single" label="Free" value="free" />,
    // @ts-expect-error -- kind is required.
    <NativeChoiceItem key="missing-kind" groupId="plan" label="Free" value="free" />,
    // @ts-expect-error -- value is required.
    <NativeChoiceItem key="missing-value" groupId="plan" kind="single" label="Free" />,
    // @ts-expect-error -- label is required.
    <NativeChoiceItem key="missing-label" groupId="plan" kind="single" value="free" />,
  ];
  expect(elements).toHaveLength(5);
});

it("requires id and kind on the group", () => {
  const group = (
    <NativeChoiceGroup id="plan" kind="single">
      <NativeChoiceItem groupId="plan" kind="single" label="Free" value="free" />
    </NativeChoiceGroup>
  );
  // @ts-expect-error -- id is required.
  const missingId = <NativeChoiceGroup kind="single" />;
  // @ts-expect-error -- kind is required.
  const missingKind = <NativeChoiceGroup id="plan" />;
  expect([group, missingId, missingKind]).toHaveLength(3);
});

it("accepts native data attributes on NativeChoice.Item slots and rejects unknown slots", () => {
  const valid = (
    <NativeChoiceItem
      groupId="plan"
      kind="single"
      label="Free"
      slotProps={{ input: { "data-testid": "free-control" }, label: { className: "label" } }}
      value="free"
    />
  );
  const invalidSlots: NativeChoiceItemSlotProps = {
    // @ts-expect-error -- NativeChoice.Item slots are limited to its rendered input, label, and panel.
    trigger: {},
  };
  const invalid = (
    <NativeChoiceItem
      groupId="plan"
      kind="single"
      label="Free"
      slotProps={invalidSlots}
      value="free"
    />
  );

  expect([valid, invalid]).toHaveLength(2);
});
