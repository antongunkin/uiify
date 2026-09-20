import { describe, expect, it, vi } from "vitest";
import { composeEventHandlers } from "./compose-event-handlers.js";

describe("composeEventHandlers", () => {
  it("runs the consumer handler before the internal one", () => {
    const calls: string[] = [];
    const handler = composeEventHandlers(
      () => calls.push("consumer"),
      () => calls.push("internal"),
    );
    handler({ defaultPrevented: false });
    expect(calls).toEqual(["consumer", "internal"]);
  });

  it("lets the consumer veto the internal action with preventDefault", () => {
    const internal = vi.fn();
    const handler = composeEventHandlers((event: { defaultPrevented: boolean }) => {
      event.defaultPrevented = true;
    }, internal);
    handler({ defaultPrevented: false });
    expect(internal).not.toHaveBeenCalled();
  });

  it("runs the internal handler when there is no consumer handler", () => {
    const internal = vi.fn();
    composeEventHandlers(undefined, internal)({ defaultPrevented: false });
    expect(internal).toHaveBeenCalledTimes(1);
  });
});
