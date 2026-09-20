import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DismissableLayer } from "./dismissable-layer.js";
import { FocusScope } from "./focus-scope.js";
import { Portal } from "./portal.js";
import { Presence } from "./presence.js";
import { RovingFocusItem, RovingFocusRoot } from "./roving-focus.js";
import { useDialog } from "./use-dialog.js";
import { usePopover } from "./use-popover.js";
import { VisuallyHidden } from "./visually-hidden.js";

function OverlayFixture() {
  const dialog = useDialog();
  const popover = usePopover();
  return (
    <>
      <button {...popover.triggerProps}>Popover trigger</button>
      <div {...popover.popupProps}>Popover</div>
      <dialog {...dialog.dialogProps}>Dialog</dialog>
    </>
  );
}
OverlayFixture.displayName = "OverlayFixture";

describe("server rendering", () => {
  it("renders every element-producing public area without DOM access", () => {
    expect(() =>
      renderToString(
        <>
          <VisuallyHidden>Hidden</VisuallyHidden>
          <FocusScope>Focus</FocusScope>
          <DismissableLayer>Layer</DismissableLayer>
          <RovingFocusRoot>
            <RovingFocusItem>Item</RovingFocusItem>
          </RovingFocusRoot>
          <Presence present>{({ ref }) => <div ref={ref}>Present</div>}</Presence>
          <Portal>Portal</Portal>
          <OverlayFixture />
        </>,
      ),
    ).not.toThrow();
  });
});
