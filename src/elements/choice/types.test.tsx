import type { ReactElement } from "react";
import { expect, it } from "vitest";
import { ChoiceGroup, ChoiceItem } from "./Choice.js";

it("requires groupId and kind explicitly on every item — Tier 0 has no context to inject them", () => {
  const elements: ReactElement[] = [
    <ChoiceItem key="default" groupId="plan" kind="single" label="Free" value="free" />,
    // @ts-expect-error -- groupId is required; there is no implicit Group -> Item injection.
    <ChoiceItem key="missing-group" kind="single" label="Free" value="free" />,
    // @ts-expect-error -- kind is required.
    <ChoiceItem key="missing-kind" groupId="plan" label="Free" value="free" />,
    // @ts-expect-error -- value is required.
    <ChoiceItem key="missing-value" groupId="plan" kind="single" label="Free" />,
    // @ts-expect-error -- label is required.
    <ChoiceItem key="missing-label" groupId="plan" kind="single" value="free" />,
  ];
  expect(elements).toHaveLength(5);
});

it("requires id and kind on the group", () => {
  const group = (
    <ChoiceGroup id="plan" kind="single">
      <ChoiceItem groupId="plan" kind="single" label="Free" value="free" />
    </ChoiceGroup>
  );
  // @ts-expect-error -- id is required.
  const missingId = <ChoiceGroup kind="single" />;
  // @ts-expect-error -- kind is required.
  const missingKind = <ChoiceGroup id="plan" />;
  expect([group, missingId, missingKind]).toHaveLength(3);
});
