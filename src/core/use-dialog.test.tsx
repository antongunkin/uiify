import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { OpenChangeDetails } from "./open-change-details.js";
import { useDialog } from "./use-dialog.js";

interface DialogFixtureProps {
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean, details: OpenChangeDetails) => void;
  readonly showModal: () => void;
}

function DialogFixture({ defaultOpen = false, onOpenChange, showModal }: DialogFixtureProps) {
  const dialog = useDialog({
    defaultOpen,
    ...(onOpenChange ? { onOpenChange } : {}),
  });
  return (
    <>
      <button onClick={dialog.openDialog}>Open</button>
      <button onClick={() => dialog.close("done")}>Close</button>
      <dialog
        {...dialog.dialogProps}
        ref={(element) => {
          if (element) {
            element.showModal = () => {
              Object.defineProperty(element, "open", {
                configurable: true,
                value: true,
                writable: true,
              });
              showModal();
            };
            element.close = (returnValue = "") => {
              element.returnValue = returnValue;
              Object.defineProperty(element, "open", {
                configurable: true,
                value: false,
                writable: true,
              });
            };
          }
          dialog.dialogRef(element);
        }}
      >
        Dialog
      </dialog>
    </>
  );
}
DialogFixture.displayName = "DialogFixture";

describe("useDialog", () => {
  it("opens a real dialog and reports trigger intent", () => {
    const showModal = vi.fn();
    const onOpenChange = vi.fn();
    render(<DialogFixture onOpenChange={onOpenChange} showModal={showModal} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(showModal).toHaveBeenCalledOnce();
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe("trigger-press");
  });

  it("allows Escape cancellation through change details", () => {
    const showModal = vi.fn();
    const onOpenChange = vi.fn((_open: boolean, details: OpenChangeDetails) => {
      details.cancel();
    });
    render(<DialogFixture defaultOpen onOpenChange={onOpenChange} showModal={showModal} />);
    const dialog = screen.getByText("Dialog");
    fireEvent(dialog, new Event("cancel", { bubbles: false, cancelable: true }));
    expect(onOpenChange.mock.calls.at(-1)?.[1].reason).toBe("escape-key");
    expect((dialog as HTMLDialogElement).open).toBe(true);
  });
});
