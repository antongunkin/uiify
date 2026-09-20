import type { ChoiceKind } from "./types.js";

/** Derived, never generated (`useId` is banned in Tier 0) — deterministic across SSR/CSR. */
export function choiceIds(groupId: string, value: string) {
  return {
    controlId: `${groupId}-control-${value}`,
    labelId: `${groupId}-label-${value}`,
    panelId: `${groupId}-panel-${value}`,
  } as const;
}

/** `"single"` returns the group id itself; `"multiple"` suffixes it, so the two groups a
 * consumer might render side by side for the same id never collide. */
export function choiceGroupName(groupId: string, kind: ChoiceKind): string {
  return kind === "single" ? groupId : `${groupId}-multiple`;
}
