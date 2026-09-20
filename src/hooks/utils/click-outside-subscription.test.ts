import { describe, expect, it, vi } from "vitest";
import { subscribeClickOutside } from "./click-outside-subscription.js";

describe("subscribeClickOutside", () => {
  it("attaches one capture listener for multiple subscribers", () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");
    const first = vi.fn();
    const second = vi.fn();

    const unsubscribeFirst = subscribeClickOutside(first);
    const unsubscribeSecond = subscribeClickOutside(second);

    expect(addSpy).toHaveBeenCalledOnce();
    expect(addSpy).toHaveBeenCalledWith("pointerdown", expect.any(Function), true);

    const event = new Event("pointerdown");
    document.dispatchEvent(event);
    expect(first).toHaveBeenCalledWith(event);
    expect(second).toHaveBeenCalledWith(event);

    unsubscribeFirst();
    expect(removeSpy).not.toHaveBeenCalled();

    unsubscribeSecond();
    expect(removeSpy).toHaveBeenCalledOnce();
    expect(removeSpy).toHaveBeenCalledWith("pointerdown", expect.any(Function), true);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
