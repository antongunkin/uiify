import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PopoverChangeHandler } from "./use-popover.js";
import { usePopover } from "./use-popover.js";

function PopoverFixture({ onOpenChange }: { readonly onOpenChange?: PopoverChangeHandler }) {
  const popover = usePopover(onOpenChange ? { onOpenChange } : {});
  return (
    <>
      <button {...popover.triggerProps} ref={popover.triggerRef}>
        Trigger
      </button>
      <div {...popover.popupProps} ref={popover.popupRef}>
        Popup
      </div>
      <output>{popover.isNative ? "native" : "fallback"}</output>
    </>
  );
}
PopoverFixture.displayName = "PopoverFixture";

const showPopoverDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "showPopover");
const hidePopoverDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "hidePopover");

afterEach(() => {
  if (showPopoverDescriptor) {
    Object.defineProperty(HTMLElement.prototype, "showPopover", showPopoverDescriptor);
  } else {
    Reflect.deleteProperty(HTMLElement.prototype, "showPopover");
  }
  if (hidePopoverDescriptor) {
    Object.defineProperty(HTMLElement.prototype, "hidePopover", hidePopoverDescriptor);
  } else {
    Reflect.deleteProperty(HTMLElement.prototype, "hidePopover");
  }
});

describe("usePopover", () => {
  it("keeps semantic expanded state in the unsupported fallback", () => {
    const onOpenChange = vi.fn();
    render(<PopoverFixture onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: "Trigger" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByText("Popup").hidden).toBe(true);
    expect(screen.getByText("fallback")).toBeTruthy();
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Popup").hidden).toBe(false);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe("trigger-press");
  });

  it("links the trigger and popup by id", () => {
    render(<PopoverFixture />);
    const trigger = screen.getByRole("button", { name: "Trigger" });
    const popup = screen.getByText("Popup");
    expect(trigger.getAttribute("aria-controls")).toBe(popup.id);
  });

  it("syncs native invoker state during click before the browser toggles the popover", () => {
    const showPopover = vi.fn();
    Object.defineProperties(HTMLElement.prototype, {
      hidePopover: { configurable: true, value: vi.fn() },
      showPopover: { configurable: true, value: showPopover },
    });
    const onOpenChange = vi.fn();
    render(<PopoverFixture onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: "Trigger" });
    const popup = screen.getByText("Popup");

    const notCanceled = fireEvent.click(trigger);

    expect(notCanceled).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(showPopover).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledOnce();
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe("native-toggle");

    const beforeToggle = new Event("beforetoggle", { cancelable: true });
    Object.defineProperty(beforeToggle, "newState", { value: "open" });
    popup.dispatchEvent(beforeToggle);

    expect(onOpenChange).toHaveBeenCalledOnce();
  });

  it("prevents the native command when the open change is canceled", () => {
    Object.defineProperties(HTMLElement.prototype, {
      hidePopover: { configurable: true, value: vi.fn() },
      showPopover: { configurable: true, value: vi.fn() },
    });
    const onOpenChange = vi.fn((open, details) => {
      if (open) details.cancel();
    });
    render(<PopoverFixture onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: "Trigger" });

    const notCanceled = fireEvent.click(trigger);

    expect(notCanceled).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(onOpenChange).toHaveBeenCalledOnce();
  });
});
