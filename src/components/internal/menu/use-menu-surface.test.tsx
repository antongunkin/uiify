import { act, render, screen } from "@testing-library/react";
import { createRef } from "react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { useMenuSurface } from "./use-menu-surface.js";

function TestMenu(): ReactElement {
  const surface = useMenuSurface({ mode: "auto" });
  const externalTrigger = createRef<HTMLButtonElement>();

  return (
    <div>
      <button
        {...surface.triggerProps}
        {...surface.anchorProps}
        ref={(element) => {
          surface.setTriggerElement(element);
        }}
        onClick={() => surface.openToItem()}
      >
        Open
      </button>
      <button ref={externalTrigger} onClick={() => surface.focusTrigger()} type="button">
        Refocus trigger
      </button>
      <div {...surface.popupProps} {...surface.positionerProps} ref={surface.contentRef}>
        <button role="menuitem" id="first">
          First
        </button>
        <button role="menuitem" id="second">
          Second
        </button>
      </div>
      <button type="button" onClick={() => surface.close()}>
        Close
      </button>
    </div>
  );
}
TestMenu.displayName = "TestMenu";

describe("useMenuSurface", () => {
  it("exposes trigger props with aria-expanded and type=button", () => {
    render(<TestMenu />);
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.getAttribute("aria-expanded")).not.toBeNull();
    expect(trigger.getAttribute("type")).toBe("button");
  });

  it("gives the surface an id matching the trigger's aria-controls", () => {
    render(<TestMenu />);
    const trigger = screen.getByRole("button", { name: "Open" });
    const controls = trigger.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    const surface = document.getElementById(controls!);
    expect(surface).not.toBeNull();
  });

  it("moves focus to the first enabled item after openToItem", async () => {
    render(<TestMenu />);
    const trigger = screen.getByRole("button", { name: "Open" });
    act(() => {
      trigger.click();
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(document.activeElement?.id).toBe("first");
  });

  it("closes via close()", () => {
    render(<TestMenu />);
    const trigger = screen.getByRole("button", { name: "Open" });
    act(() => {
      trigger.click();
    });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const closeButton = screen.getByRole("button", { name: "Close" });
    act(() => {
      closeButton.click();
    });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("returns focus to the element passed to setTriggerElement via focusTrigger()", () => {
    render(<TestMenu />);
    const trigger = screen.getByRole("button", { name: "Open" });
    const refocus = screen.getByRole("button", { name: "Refocus trigger" });
    trigger.focus();
    refocus.focus();
    expect(document.activeElement).toBe(refocus);
    act(() => {
      refocus.click();
    });
    expect(document.activeElement).toBe(trigger);
  });
});
