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

  it("closes dialogs nested inside before it closes itself", () => {
    const { rerender } = render(
      <ModalClientContent aria-label="Parent" id="parent" open>
        <dialog data-testid="child" open />
      </ModalClientContent>,
    );
    const parent = document.querySelector<HTMLDialogElement>("dialog[data-uiify-modal]")!;
    const child = screen.getByTestId("child") as HTMLDialogElement;
    expect(parent.open).toBe(true);
    close.mockClear();

    rerender(
      <ModalClientContent aria-label="Parent" id="parent" open={false}>
        <dialog data-testid="child" open />
      </ModalClientContent>,
    );

    expect(close.mock.contexts).toEqual([child, parent]);
    expect(child.open).toBe(false);
    expect(parent.open).toBe(false);
  });

  it("reports completion once the dialog's animations have settled", async () => {
    const onOpenChangeComplete = vi.fn();
    render(
      <ModalClientContent
        aria-label="Settings"
        id="settings"
        onOpenChangeComplete={onOpenChangeComplete}
      >
        Body
      </ModalClientContent>,
    );
    const dialog = getModal();
    let finish: () => void = () => {};
    let asked = false;
    Object.defineProperty(dialog, "getAnimations", {
      configurable: true,
      value: () => {
        asked = true;
        return [
          {
            finished: new Promise<void>((resolve) => {
              finish = resolve;
            }),
          },
        ];
      },
    });

    nativeToggle(dialog, "open");
    await vi.waitFor(() => expect(asked).toBe(true));
    expect(onOpenChangeComplete).not.toHaveBeenCalled();
    finish();
    await vi.waitFor(() => expect(onOpenChangeComplete).toHaveBeenCalledExactlyOnceWith(true));
  });

  it("ignores infinite animations (a spinner in the body) when it waits for completion", async () => {
    const onOpenChangeComplete = vi.fn();
    render(
      <ModalClientContent
        aria-label="Settings"
        id="settings"
        onOpenChangeComplete={onOpenChangeComplete}
      >
        Body
      </ModalClientContent>,
    );
    const dialog = getModal();
    let finish: () => void = () => {};
    let asked = false;
    Object.defineProperty(dialog, "getAnimations", {
      configurable: true,
      value: () => {
        asked = true;
        return [
          {
            // An `infinite` CSS animation: `finished` never settles.
            effect: { getComputedTiming: () => ({ endTime: Infinity }) },
            finished: new Promise<void>(() => {}),
          },
          {
            effect: { getComputedTiming: () => ({ endTime: 200 }) },
            finished: new Promise<void>((resolve) => {
              finish = resolve;
            }),
          },
        ];
      },
    });

    nativeToggle(dialog, "open");
    await vi.waitFor(() => expect(asked).toBe(true));
    expect(onOpenChangeComplete).not.toHaveBeenCalled();
    finish();
    await vi.waitFor(() => expect(onOpenChangeComplete).toHaveBeenCalledExactlyOnceWith(true));
  });

  it("reports a programmatic close as false, once", async () => {
    const onOpenChange = vi.fn();
    const onOpenChangeComplete = vi.fn();
    const { rerender } = render(
      <ModalClientContent
        aria-label="Settings"
        id="settings"
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        open
      >
        Body
      </ModalClientContent>,
    );
    const dialog = getModal();
    expect(dialog.open).toBe(true);
    rerender(
      <ModalClientContent
        aria-label="Settings"
        id="settings"
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        open={false}
      >
        Body
      </ModalClientContent>,
    );
    expect(close).toHaveBeenCalledTimes(1);
    // The close stub does not dispatch `toggle`; a real browser does, as a queued task.
    nativeToggle(dialog, "closed");
    await vi.waitFor(() => expect(onOpenChangeComplete).toHaveBeenCalledExactlyOnceWith(false));
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(onOpenChangeComplete).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("does not report completion after it unmounted mid-transition", async () => {
    const onOpenChangeComplete = vi.fn();
    const { unmount } = render(
      <ModalClientContent
        aria-label="Settings"
        id="settings"
        onOpenChangeComplete={onOpenChangeComplete}
      >
        Body
      </ModalClientContent>,
    );
    const dialog = getModal();
    let finish: () => void = () => {};
    let asked = false;
    Object.defineProperty(dialog, "getAnimations", {
      configurable: true,
      value: () => {
        asked = true;
        return [
          {
            finished: new Promise<void>((resolve) => {
              finish = resolve;
            }),
          },
        ];
      },
    });

    nativeToggle(dialog, "open");
    await vi.waitFor(() => expect(asked).toBe(true));
    unmount();
    finish();
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(onOpenChangeComplete).not.toHaveBeenCalled();
  });

  it("does not report completion before the dialog toggles", async () => {
    const onOpenChangeComplete = vi.fn();
    render(
      <ModalClientContent
        aria-label="Settings"
        id="settings"
        onOpenChangeComplete={onOpenChangeComplete}
      >
        Body
      </ModalClientContent>,
    );
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(onOpenChangeComplete).not.toHaveBeenCalled();
  });

  it("reports completion for the defaultOpen transition after hydration", async () => {
    const onOpenChange = vi.fn();
    const onOpenChangeComplete = vi.fn();
    render(
      <ModalClientContent
        aria-label="Settings"
        defaultOpen
        id="settings"
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
      >
        Body
      </ModalClientContent>,
    );
    const dialog = getModal();
    expect(showModal).toHaveBeenCalledTimes(1);
    // This file's showModal stub does not dispatch `toggle`; a real browser does,
    // as a queued task after the mount effect, so dispatch it here.
    nativeToggle(dialog, "open");
    await vi.waitFor(() => expect(onOpenChangeComplete).toHaveBeenCalledExactlyOnceWith(true));
    // The programmatic change already matched the wanted state.
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("renders the appearance attributes and closedby=any by default", () => {
    render(
      <ModalClientContent aria-label="Settings" id="settings" size="lg">
        Body
      </ModalClientContent>,
    );
    const dialog = getModal();
    expect(dialog.getAttribute("closedby")).toBe("any");
    expect(dialog.getAttribute("data-size")).toBe("lg");
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
