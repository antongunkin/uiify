import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { RovingFocusItem, RovingFocusRoot } from "./roving-focus.js";
import { usePopover } from "./use-popover.js";

function Fixture() {
  const popover = usePopover();
  return (
    <>
      <button {...popover.triggerProps}>Toggle</button>
      <div {...popover.popupProps}>Popup</div>
      <RovingFocusRoot>
        <RovingFocusItem>One</RovingFocusItem>
        <RovingFocusItem>Two</RovingFocusItem>
      </RovingFocusRoot>
    </>
  );
}
Fixture.displayName = "Fixture";

describe("hydration", () => {
  it("hydrates stable server markup without mismatch warnings", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<Fixture />);
    document.body.append(container);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, <Fixture />);
    });
    expect(consoleError.mock.calls.some(([message]) => String(message).includes("hydration"))).toBe(
      false,
    );
    await act(async () => root?.unmount());
    consoleError.mockRestore();
  });
});
