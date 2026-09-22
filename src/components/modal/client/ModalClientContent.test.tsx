import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { StrictMode, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../../test-utils/ssr.js";
import { ModalClientContent } from "./ModalClientContent.js";

// jsdom 29 implements neither showModal() nor requestClose(); stub the native
// methods so the adapter's calls are observable. Real modality is covered by
// e2e/specs/native-composition.spec.ts in three engines.
const showModal = vi.fn(function (this: HTMLDialogElement) {
  this.open = true;
});
const close = vi.fn(function (this: HTMLDialogElement) {
  this.open = false;
});
const requestClose = vi.fn(function (this: HTMLDialogElement) {
  this.open = false;
});

beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: showModal,
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: close });
  Object.defineProperty(HTMLDialogElement.prototype, "requestClose", {
    configurable: true,
    value: requestClose,
  });
});

beforeEach(() => {
  showModal.mockClear();
  close.mockClear();
  requestClose.mockClear();
});

/** Simulate the browser opening/closing the dialog natively (command, Escape, form). */
function nativeToggle(dialog: HTMLDialogElement, newState: "open" | "closed"): void {
  act(() => {
    dialog.open = newState === "open";
    dialog.dispatchEvent(Object.assign(new Event("toggle"), { newState }));
  });
}

function getModal(): HTMLDialogElement {
  return screen.getByRole("dialog", { hidden: true }) as HTMLDialogElement;
}

function stubDialogBox(dialog: HTMLDialogElement): void {
  vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({
    bottom: 300,
    height: 200,
    left: 100,
    right: 300,
    top: 100,
    width: 200,
    x: 100,
    y: 100,
    toJSON: () => ({}),
  });
}

function ControlledHarness({ onOpenChange }: { readonly onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(false)}>
        Force close
      </button>
      <ModalClientContent
        aria-label="Controlled"
        id="controlled"
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange?.(next);
        }}
        open={open}
      >
        Body
      </ModalClientContent>
    </>
  );
}
ControlledHarness.displayName = "ControlledHarness";

describe("ModalClientContent", () => {
  it("renders closed markup on the server even with defaultOpen", () => {
    const html = renderToStaticMarkup(
      <ModalClientContent aria-label="Settings" defaultOpen id="settings">
        Body
      </ModalClientContent>,
    );
    expect(html).toContain('<dialog aria-label="Settings"');
    expect(html).not.toContain("<dialog open");
    expect(html).not.toContain(" open=");
    expect(html).not.toContain("popover=");
  });

  it("opens modally after mount when defaultOpen is set", () => {
    render(
      <ModalClientContent aria-label="Settings" defaultOpen id="settings">
        Body
      </ModalClientContent>,
    );
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(getModal().open).toBe(true);
  });

  it("reports a native open once and keeps the uncontrolled dialog open", () => {
    const onOpenChange = vi.fn();
    render(
      <ModalClientContent aria-label="Settings" id="settings" onOpenChange={onOpenChange}>
        Body
      </ModalClientContent>,
    );
    nativeToggle(getModal(), "open");
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(close).not.toHaveBeenCalled();
    expect(getModal().open).toBe(true);

    nativeToggle(getModal(), "closed");
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(showModal).not.toHaveBeenCalled();
  });

  it("reverts a native open that the controlling parent rejects, without a second callback", () => {
    const onOpenChange = vi.fn();
    render(
      <ModalClientContent
        aria-label="Settings"
        id="settings"
        onOpenChange={onOpenChange}
        open={false}
      >
        Body
      </ModalClientContent>,
    );
    nativeToggle(getModal(), "open");
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
    expect(getModal().open).toBe(false);
  });

  it("follows a controlling parent that accepts native changes and closes on demand", () => {
    const onOpenChange = vi.fn();
    render(<ControlledHarness onOpenChange={onOpenChange} />);
    nativeToggle(getModal(), "open");
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(close).not.toHaveBeenCalled();
    expect(getModal().open).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Force close" }));
    expect(close).toHaveBeenCalledTimes(1);
    expect(getModal().open).toBe(false);
  });

  it("closes on backdrop click only when enabled, after the consumer onClick", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <ModalClientContent aria-label="Settings" id="settings" onClick={onClick}>
        <p>Body</p>
      </ModalClientContent>,
    );
    fireEvent.click(getModal());
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(requestClose).not.toHaveBeenCalled();

    rerender(
      <ModalClientContent
        aria-label="Settings"
        closeOnBackdropClick
        id="settings"
        onClick={onClick}
      >
        <p>Body</p>
      </ModalClientContent>,
    );
    const dialog = getModal();
    stubDialogBox(dialog);
    fireEvent.click(dialog, { clientX: 106, clientY: 106 });
    expect(requestClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Body"));
    expect(requestClose).not.toHaveBeenCalled();
    fireEvent.click(dialog, { clientX: 50, clientY: 50 });
    expect(requestClose).toHaveBeenCalledTimes(1);

    const veto = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    rerender(
      <ModalClientContent aria-label="Settings" closeOnBackdropClick id="settings" onClick={veto}>
        <p>Body</p>
      </ModalClientContent>,
    );
    fireEvent.click(dialog, { clientX: 50, clientY: 50 });
    expect(veto).toHaveBeenCalledTimes(1);
    expect(requestClose).toHaveBeenCalledTimes(1);
  });

  describe("pre-hydration reconciliation", () => {
    async function hydrateWithPreOpen(
      ui: ReactElement,
      preOpen: boolean,
    ): Promise<{ dialog: HTMLDialogElement; unmount: () => void }> {
      const container = document.createElement("div");
      container.innerHTML = renderToString(ui);
      document.body.append(container);
      const dialog = container.querySelector("dialog") as HTMLDialogElement;
      // Simulate the browser having opened the dialog via a native invoker command
      // in the window before this component hydrated. The `toggle` already fired and
      // was lost; only the DOM state remains.
      if (preOpen) dialog.open = true;
      let root: ReturnType<typeof hydrateRoot>;
      await act(async () => {
        root = hydrateRoot(container, ui);
      });
      return { dialog, unmount: () => act(() => root.unmount()) };
    }

    it("recovers an uncontrolled native open that happened before hydration", async () => {
      const onOpenChange = vi.fn();
      const { dialog } = await hydrateWithPreOpen(
        <ModalClientContent aria-label="S" id="s" onOpenChange={onOpenChange}>
          Body
        </ModalClientContent>,
        true,
      );
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(dialog.open).toBe(true);
      expect(close).not.toHaveBeenCalled();
    });

    it("reports then reverts a pre-hydration open the controlling parent rejects", async () => {
      const onOpenChange = vi.fn();
      const { dialog } = await hydrateWithPreOpen(
        <ModalClientContent aria-label="S" id="s" onOpenChange={onOpenChange} open={false}>
          Body
        </ModalClientContent>,
        true,
      );
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(close).toHaveBeenCalledTimes(1);
      expect(dialog.open).toBe(false);
    });

    it("does not misread defaultOpen's closed SSR markup as a pre-hydration close", async () => {
      const onOpenChange = vi.fn();
      const { dialog } = await hydrateWithPreOpen(
        <ModalClientContent aria-label="S" defaultOpen id="s" onOpenChange={onOpenChange}>
          Body
        </ModalClientContent>,
        false,
      );
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(showModal).toHaveBeenCalledTimes(1);
      expect(dialog.open).toBe(true);
    });

    it("does not report a pre-hydration open+close cycle that nets back to closed", async () => {
      // By design this is DOM-identical to a plain closed mount: the DOM retains no
      // `toggle` history, so a net-zero cycle cannot be distinguished from "nothing
      // happened" — there is no separate code path to exercise, only the shared one.
      const onOpenChange = vi.fn();
      await hydrateWithPreOpen(
        <ModalClientContent aria-label="S" id="s" onOpenChange={onOpenChange}>
          Body
        </ModalClientContent>,
        false, // net-zero: DOM is closed again by hydration time, no evidence remains
      );
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("reports the recovered open exactly once under StrictMode", async () => {
      const onOpenChange = vi.fn();
      await hydrateWithPreOpen(
        <StrictMode>
          <ModalClientContent aria-label="S" id="s" onOpenChange={onOpenChange}>
            Body
          </ModalClientContent>
        </StrictMode>,
        true,
      );
      expect(onOpenChange).toHaveBeenCalledTimes(1);
    });
  });
});
