import { describe, expect, it } from "vitest";
import { createOpenChangeDetails } from "./open-change-details.js";

describe("createOpenChangeDetails", () => {
  it("preserves the event and tracks cancellation independently", () => {
    const event = new Event("click");
    const details = createOpenChangeDetails("outside-press", event);
    expect(details.event).toBe(event);
    expect(details.isCanceled).toBe(false);
    details.cancel();
    expect(details.isCanceled).toBe(true);
    expect(event.defaultPrevented).toBe(false);
  });
});
