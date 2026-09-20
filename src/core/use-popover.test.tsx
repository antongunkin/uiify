import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
});
